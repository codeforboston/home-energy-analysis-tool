import { Outlet } from '@remix-run/react'

export default function Cases() {
    return(
        <div className="w-100p h-100p bk-primary">
            <h1>Case name</h1>
            <Outlet/>
        </div>
    )
}
