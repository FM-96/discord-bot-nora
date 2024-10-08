import { GraphQLClient } from 'graphql-request';
import EgsGame from '../models/EgsGame';
import client from './client';

const graphql = new GraphQLClient('https://graphql.epicgames.com/graphql');

const QUERY = `
query promotionsQuery($namespace: String!, $country: String!, $locale: String!) {
	Catalog {
		catalogOffers(namespace: $namespace, locale: $locale, params: {category: "freegames", country: $country, sortBy: "effectiveDate", sortDir: "asc"}) {
			elements {
				title
				description
				id
				namespace
				categories {
					path
				}
				linkedOfferNs
				linkedOfferId
				keyImages {
					type
					url
				}
				productSlug
				promotions {
					promotionalOffers {
						promotionalOffers {
							startDate
							endDate
							discountSetting {
								discountType
								discountPercentage
							}
						}
					}
					upcomingPromotionalOffers {
						promotionalOffers {
							startDate
							endDate
							discountSetting {
								discountType
								discountPercentage
							}
						}
					}
				}
			}
		}
	}
}`;

const VARIABLES = {
	namespace: 'epic',
	country: 'AT',
	locale: 'en-US',
};

interface PromotionsResponse {
	Catalog: {
		catalogOffers: {
			elements: {
				title: string;
				description: string;
				id: string;
				namespace: string;
				categories: {
					path: string;
				}[];
				linkedOfferNs: string;
				linkedOfferId: string;
				keyImages: {
					type: string;
					url: string;
				}[];
				productSlug: string;
				promotions: {
					promotionalOffers: {
						promotionalOffers: Promotion[];
					}[];
					upcomingPromotionalOffers: {
						promotionalOffers: Promotion[];
					}[];
				};
			}[];
		};
	};
}

interface Promotion {
	startDate: string;
	endDate: string;
	discountSetting: {
		discountType: string;
		discountPercentage: number;
	};
}

export async function check() {
	try {
		const data = await graphql.request<PromotionsResponse>(QUERY, VARIABLES);
		const currentGames = data.Catalog.catalogOffers.elements.filter(
			(e) =>
				e.promotions &&
				e.promotions.promotionalOffers.length > 0 &&
				e.promotions.promotionalOffers[0].promotionalOffers.some(filterPromotionisFree),
		);
		const dbGames = await EgsGame.find({}).exec();

		// remove games from DB that are no longer free
		const removals = [];
		for (const dbGame of dbGames) {
			if (!currentGames.map((e) => e.id).includes(dbGame.gameId)) {
				removals.push(dbGame.remove());
			}
		}
		await Promise.all(removals);

		const channel = client.instance?.channels.cache.get('133750021861408768');
		if (!channel?.isText()) {
			throw new Error('Invalid channel');
		}

		// add new free games to DB and send message(s)
		for (const currentGame of currentGames) {
			if (!dbGames.map((e) => e.gameId).includes(currentGame.id)) {
				const freePromotion =
					currentGame.promotions.promotionalOffers[0].promotionalOffers.find(filterPromotionisFree);
				if (!freePromotion) {
					continue;
				}
				await channel.send(
					`**${currentGame.title}** is free on EGS until ${freePromotion.endDate}:\nhttps://www.epicgames.com/store/en-US/product/${currentGame.productSlug}`,
				);
				const newDbGame = new EgsGame({ gameId: currentGame.id });
				await newDbGame.save();
			}
		}
	} catch (err) {
		console.error('Error while checking EGS games:');
		console.error(err);
	}
}

function filterPromotionisFree(promotionalOffer: Promotion) {
	return (
		promotionalOffer.discountSetting.discountType === 'PERCENTAGE' &&
		promotionalOffer.discountSetting.discountPercentage === 0
	);
}
