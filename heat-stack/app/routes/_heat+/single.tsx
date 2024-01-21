import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import HeatLoadAnalysis from './heatloadanalysis.tsx'
import { useState } from 'react'

// interface MyNumProps { my_num: number }
// interface IncrementProps { increment: Function }



import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { getSession, commitSession } from "../../sessions";

type MyNumProps = { my_num?: number, session?: unknown }


export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  const data = {
  	error: session.get("error"),
  	num2: session.get("num2"),
  };


  console.log(`session get:`, JSON.stringify( session ) );

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}


export async function action({
  request,
}: ActionFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const form = await request.formData();

  console.log(`session post before:`, JSON.stringify( session ) );
  console.log(`headers:`, JSON.stringify( request.headers ) );

  if ( !session.has("num2") ) {
  // 	session.get("num2")
  // } else {
  	// num2 = 3;
  	session.set("num2", 3)
  }

  // const num2 = form.get("num2") ?? 3;
  let num = session.get("num2") + 3
  session.set("num2", num);

  console.log(`form:`, JSON.stringify( form ) );
  console.log(`session post after:`, JSON.stringify( session ) );

  // Login succeeded, send them to the home page.
  return redirect("/single", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}


export default function Inputs() {
	let [num_obj, setNum] = useState<MyNumProps>({ my_num: 5 });
	const incrementByFive = () => {
		setNum(prevNum => ({ my_num: prevNum.my_num + 5 }));
	};

	const data = useLoaderData<typeof loader>();

	console.log( `data:`, data );
	console.log( `my_num:`, num_obj );

	return (
		<div>
			<HomeInformation increment={ incrementByFive } session={data} />
			<CurrentHeatingSystem my_num={num_obj.my_num} session={data} />
			<EnergyUseHistory />
			<HeatLoadAnalysis />
		</div>
	)
}
