// import { json, type DataFunctionArgs } from 'r'
import { data, Outlet, useLoaderData } from 'react-router'
import { Fragment } from 'react'
import { type Route } from './+types/$analysisid.ts'

export async function loader({ params }: Route.LoaderArgs) {
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
    
    return data({
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
