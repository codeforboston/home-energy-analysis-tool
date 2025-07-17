import * as pyodideModule from 'pyodide'
import processPyCode from '../pycode/process.py?raw';
import utilFunctionsPyCode from '../pycode/util_functions.py?raw';

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
        // Load utility functions
        this.pyodideModule.runPython(utilFunctionsPyCode);
        // Use get_py_imp_obj function to get the class
        let r = this.pyodideModule.runPython(`
        from rules_engine.pydantic_models import ${name}
        from pyodide.ffi import to_js
        import js
        ${name}`);
        return r;
    }

    async makeSI(si) {
        console.log("Makin SI name:"+ si.name);
        // Load utility functions
        this.pyodideModule.runPython(utilFunctionsPyCode);
        // Use make_si function
        let f = this.pyodideModule.runPython(`
        def f(s):
            return HeatLoadInput(**s)
        f
        `);
        let fr = f(si);
        console.log(`FR: ${fr}`);
        return fr;
    }

    getSIO() {
        // Load utility functions
        this.pyodideModule.runPython(utilFunctionsPyCode);
        // Use get_sio function
        let r = this.pyodideModule.runPython(`
        from rules_engine.pydantic_models import HeatLoadInput
        from pyodide.ffi import to_js
        import js
        HeatLoadInput`);
        return r;
    }

    runit(rs,rn,rt,rb) {
        // Load process module
        this.pyodideModule.runPython(processPyCode);
        // Use process function from the loaded module
        let pyProcess = this.pyodideModule.runPython(`
        from pycode.process import process
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