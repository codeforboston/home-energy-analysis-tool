import React from 'react'
import { Link } from 'react-router'

export default function Home() {
	return (
		<div>
			<h1>
				This is the Heat Home page - the first page a user will see when
				starting the app
			</h1>
			<br />
			<ul>
				Some paths with placeholder pages are:
				<li>
					<u>
						<Link to="single">/single</Link>
					</u>
					- view all screens on a single page
				</li>
				<li>
					<u>
						<Link to="inputs1">/inputs1</Link>
					</u>
					- view input screen 1 - Home Information
				</li>
				<li>
					<u>
						<Link to="inputs2">/inputs2</Link>
					</u>
					- view input screen 2 - Existing Heating System
				</li>
				<li>
					<u>
						<Link to="inputs3">/inputs3</Link>
					</u>
					- view screen 3 - Summary of Heating Use
				</li>
				<li>
					<u>
						<Link to="cases">/cases</Link>
					</u>
					- view a list of cases
				</li>
			</ul>
		</div>
	)
}
