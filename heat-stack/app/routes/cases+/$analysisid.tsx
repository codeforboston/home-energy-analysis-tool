import { json, type DataFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Fragment } from 'react'

export async function loader({ params }: DataFunctionArgs) {
    // // From the database:
	// const user = await prisma.user.findFirst({
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		username: true,
	// 		createdAt: true,
	// 		image: { select: { id: true } },
	// 	},
	// 	where: {
	// 		username: params.username,
	// 	},
	// })
    
    return json({
        id: params.analysisid
        })
}

export default function Analysis () {
	const data = useLoaderData<typeof loader>()
    const id = data?.id

    return (
        <Fragment>
            <h1>{ id }</h1>
            {/* <Outlet /> */}
        </Fragment>
    )
}
