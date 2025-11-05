import * as pyodideModule from 'pyodide'
// import GeocodeUtil from "#app/utils/GeocodeUtil";
// import WeatherUtil from "#app/utils/WeatherUtil";

export default function Foo() {
	const getPyodide = async () => {
		// public folder needed in path because it is in NodeJS instead of the browser:
		let thing = await pyodideModule.loadPyodide({
			indexURL: `/pyodide-env/`,
		})
		console.log(thing)
		return thing
	}
	void getPyodide()
	return <div>Hello</div>
}

// const Thing = lazy(() => import("./pyodide.client.tsx"));
