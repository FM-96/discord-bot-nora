import mongoose from 'mongoose';

interface IEgsGame {
	gameId: string;
}

const schema = new mongoose.Schema<IEgsGame>({
	gameId: String,
});

export default mongoose.model<IEgsGame>('EgsGame', schema, 'egsgames');
