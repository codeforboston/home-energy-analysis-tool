/** consider removing "use client" which was added to allow a purely local button onClick for proof-of-concept */
'use client';
import Image from 'next/image';
import Script from 'next/script';
import engine from '../../../rules-engine/src/rules_engine/engine.py';
import { useState, useEffect } from 'react';
// import { HomeData } from './types';
import { LineChart } from './components/lineChart';
import { TwoLineChart } from './components/twoLineChart';
import { uaData, uaChange } from './data';

/** https://stackoverflow.com/questions/74471642/nextjs-13-button-onclick-event-handlers-cannot-be-passed-to-client-componen
 * Try the configuration here too : https://stackoverflow.com/questions/75310292/how-can-i-include-files-from-node-modules-in-my-next-js-build-so-that-they-can-b#
 * then remove pyodide from package.json and from public folder.
 */
const getPyodide = async () => {
  if (!('pyodide' in window)) {
    window.pyodide = await window.loadPyodide();

    // public folder:
    // window.pyodide = await window.loadPyodide({
    //   indexURL: "pyodide/"
    // });
    // await window.pyodide.loadPackage("Pillow");
  }

  return window.pyodide;
};

const runPythonScript = async () => {
  const pyodide = await getPyodide();
  console.log(engine);
  await pyodide.runPythonAsync(engine);
  return pyodide;
};

export default function Home() {
  // const [homeData, setHomeData] = useState<HomeData | null>(null);

  const [output, setOutput] = useState<string>('loading...');

  const [userData, setUserData] = useState({
    labels: uaData.map((data) => data.balancePoint),
    datasets: [
      {
        label: 'Standard Deviation',
        data: uaData.map((data) => data.standardDeviation * 100),
      },
    ],
  });

  const [userUaData, setUserUaData] = useState({
    labels: uaChange.map((data) => data.dhw),
    datasets: [
      {
        label: 'Change in UA',
        data: uaChange.map((data) => data.uaChange),
        yAxisID: 'y',
      },
      {
        label: '% Change',
        data: uaChange.map((data) => data.uaChangePercent * 100),
        yAxisID: 'y1',
      },
    ],
  });

  useEffect(() => {
    const run = async () => {
      const pyodide = await runPythonScript();
      console.log(pyodide);
      const result = await pyodide.runPythonAsync('hdd(57, 60)');
      setOutput(result);
    };
    run();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Script
        strategy="beforeInteractive"
        src="https://cdn.jsdelivr.net/pyodide/v0.23.3/full/pyodide.js"
      />
      <div>{output}</div>
      <LineChart data={userData} />
      <TwoLineChart data={userUaData} />
      {/*
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
  </div>*/}
    </main>
  );
}
