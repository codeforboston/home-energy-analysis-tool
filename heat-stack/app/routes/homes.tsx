import  {
  type ActionFunctionArgs,
  redirect
} from "react-router";
import { type Route } from './+types/homes.tsx'


export async function action({
	request
}: Route.ActionArgs) {
	const formData = await request.formData()

	formData.forEach(d => console.log(d))
	
	return redirect("/inputs1")
}

