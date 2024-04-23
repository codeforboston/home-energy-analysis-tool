import * as pyodideModule from 'pyodide'


class PyodideUtil {
    static _instance;
    constructor() {
        // if(PyodideUtil._instance) {
        //     return PyodideUtil._instance;
        // }
        // PyodideUtil._instance = this;
        // return this;
    }

    static getInstance() {
        if(!this._instance) {
            this._instance = new PyodideUtil();
        }
        return this._instance;
        
    }

    async getPyodideModule() {
        if(!this.pyodideModule) {
            this.pyodideModule = await loadPyodideModule();
        }
        return this.pyodideModule;
    }
    async getEngineModule() {
        if(!this.pyodideModule) {
            throw new Error("Util not created.");
        }
        return await getEngine(this.pyodideModule);
    }

    makePyImpObj(EngineObj) {
        let name = EngineObj.constructor.name;
		let r = this.pyodideModule.runPython(`
		from rules_engine.pydantic_models import ${name}
		from pyodide.ffi import to_js
		import js
		${name}`);
		return r;

		// return await this.pyodideModule.toPy(thing);
    }

	async makeSI(si) {
		console.log("Makin SI name:"+ si.name);
		let f = this.pyodideModule.runPython(`
		def f(s):
			return SummaryInput(**s)
		f
		`);
		let fr = f(si);
		console.log(`FR: ${fr}`);
		return fr;
	}

	getSIO() {
		let r = this.pyodideModule.runPython(`
		from rules_engine.pydantic_models import SummaryInput
		from pyodide.ffi import to_js
		import js
		SummaryInput`);
		return r;
	}

    runit(rs,rn,rt,rb) {
		let pyProcess = this.pyodideModule.runPython(`
		import json
		from pyodide.ffi import to_js, JsProxy
		from pyodide.code import run_js
		import js
		from datetime import date
		from rules_engine import engine
		from rules_engine.pydantic_models import (
			AnalysisType,
			BalancePointGraph,
			BalancePointGraphRow,
			Constants,
			DhwInput,
			FuelType,
			NaturalGasBillingInput,
			NormalizedBillingPeriodRecordInput,
			OilPropaneBillingInput,
			SummaryInput,
			SummaryOutput,
			TemperatureInput,
		)
		
		def default_converter(value,_i1m,_i2):
			#print("value: "+str(value))
			if 'Date' == str(value.constructor.name):
				return date.fromtimestamp(value.valueOf() / 1000)
			return value
		
		def process(s,n,t,b):
			print("S INIT: ")
			print(type(s))
			
			s = s.as_object_map()
			sv = s.values()
			svm = sv._mapping
			

			t = t.to_py(default_converter=default_converter)

			summa_inpoot = SummaryInput(**svm)
			tempinz = TemperatureInput(**t)


			b = json.loads(b)
			billy_normz = []
			for x in b:
				print(x)
				billy_normz.append(NormalizedBillingPeriodRecordInput(**x))


			print(type(summa_inpoot))
			print(type(tempinz))
			print(type(billy_normz))
			print(summa_inpoot)
			print(tempinz)
			print(billy_normz)

			r = engine.get_outputs_normalized(summa_inpoot,None,tempinz,billy_normz)
			print(r)
			return r
		process
	`);

        let rezz = pyProcess(rs,rn,rt,rb);
        console.log(`Le Rezz: ${rezz}`);
    }
}



const loadPyodideModule = async () => {
	// public folder:
	return await pyodideModule.loadPyodide({
		indexURL: 'public/pyodide-env/',
		packages:["numpy","pydantic","pydantic_core","annotated_types","rules_engine"]
	});
}

const getEngine = async(pyodide) => {
    return await pyodide.pyimport("rules_engine.engine");
}

const testPythonScript = async () => {
	const pyodide = await loadPyodideModule()

	let pm = await pyodide.pyimport("rules_engine.engine");
	let r = pm.hdd(57,60);
	console.log(pm.toString());
	console.log(r);
	// window.pydd = pyodide; //no eye deer what this does. hopefully its not needed after moving.

	return pyodide;
}


const getPydanticModel = () => {

}
export default PyodideUtil;