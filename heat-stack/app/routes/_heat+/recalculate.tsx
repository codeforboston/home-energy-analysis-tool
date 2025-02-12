// This is a shell for the /recalculate route

import {  type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

export async function action({ request, params }: ActionFunctionArgs) {
    return null
}

export default function Recalculate() {

    const lastResult = useActionData<typeof action>()
    
    return(
        <>        
            <Form
                // id={form.id}
                // method="post"
                // onSubmit={form.onSubmit}
                // action="/recalculate"
            >
                {' '}
                {/* https://github.com/edmundhung/conform/discussions/547 instructions on how to properly set default values
            This will make it work when JavaScript is turned off as well 
            <Input {...getInputProps(props.fields.address, { type: "text" })} /> */}
                {/* <HomeInformation fields={fields} />
                <CurrentHeatingSystem fields={fields} />
                <EnergyUseHistory usage_data={ currentUsageData || {} as UsageDataSchema } show_usage_data={show_usage_data} /> */}
                
                {/* <ErrorList id={form.errorId} errors={form.errors} /> */}
            </Form>
            {/* <HeatLoadAnalysis heatLoadSummaryOutput={currentUsageData?.heat_load_output} />  */}
        </>    
    )
}