export type DailyWeather = {
    time: string[],
    temperature_2m_max: number[]
}

export type Weather = {
	daily: DailyWeather
}