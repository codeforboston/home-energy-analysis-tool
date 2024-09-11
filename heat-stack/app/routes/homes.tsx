import  {
  type ActionFunctionArgs,
  redirect
} from "@remix-run/node";

export async function action({
	request
}: ActionFunctionArgs) {
	const formData = await request.formData()

	formData.forEach(d => console.log(d))
	
	return redirect("/inputs1")
}

