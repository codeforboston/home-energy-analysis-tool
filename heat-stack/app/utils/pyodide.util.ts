import * as pyodideModule from 'pyodide'

class PyodideUtil {
  static _instance:any
  pyodideModule:any;

  constructor() {
    // if(PyodideUti.l._instance) {
    //     return PyodideUtil._instance;
    // }
    // PyodideUtil._instance = this;
    // return this;
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new PyodideUtil()
    }
    return this._instance
  }

  async getPyodideModule() {
    if (!this.pyodideModule) {
      this.pyodideModule = await loadPyodideModule() 
    }
    return this.pyodideModule 
  }
  async getEngineModule() {
    if (!this.pyodideModule) {
      throw new Error('Util not created.')
    }
    return await getEngine(this.pyodideModule);
  }

  async getHelpersModule() {
    if (!this.pyodideModule) {
      throw new Error('Util not created.')
    }
    return await getHelpers(this.pyodideModule);
  }

  async getParserModule() {
    if (!this.pyodideModule) {
      throw new Error('Util not created.')
    }
    return await getParser(this.pyodideModule);
  }
}

const loadPyodideModule = async () => {
  // public folder:
  return await pyodideModule.loadPyodide({
    indexURL: 'public/pyodide-env/',
    packages: ['numpy','pydantic','pydantic_core','annotated_types','rules_engine',]
  });
}

const getEngine = async (pyodide: any)=> {
  return await pyodide.pyimport('rules_engine.engine');
}

const getHelpers = async (pyodide: any)=> {
  return await pyodide.pyimport('rules_engine.helpers');
}

const getParser = async (pyodide: any)=> {
  return await pyodide.pyimport('rules_engine.parser');
}

const testPythonScript = async () => {
  const pyodide = await loadPyodideModule()

  let pm = await pyodide.pyimport('rules_engine.engine');
  let r = pm.hdd(57, 60);
  console.log(pm.toString());
  console.log(r);

  return pyodide;
}

export default PyodideUtil
