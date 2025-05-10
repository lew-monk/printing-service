import dotenv from "dotenv";

dotenv.config();

interface Config {
	PORT: number;
	ENVIRONMENT: string;
}

const config: Config = {
	PORT: parseInt(process.env.PORT || "8050", 10),
	ENVIRONMENT: process.env.NODE_ENV || "development",
};

export default config;
