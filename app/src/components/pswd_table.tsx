import React from "react";

const PasswordTable = () => {
	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
					<div className="overflow-hidden">
						<table className="min-w-full text-left text-sm font-light">
							<thead className="border-b font-medium">
								<tr>
									<th scope="col" className="px-6 py-4">
										Icon
									</th>
									<th scope="col" className="px-6 py-4">
										Name
									</th>
									<th scope="col" className="px-6 py-4">
										Website
									</th>
									<th scope="col" className="px-6 py-4">
										Last Used
									</th>
									<th scope="col" className="px-6 py-4">
										Date Used
									</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b">
									<td className="whitespace-nowrap px-6 py-4 w-24">
										<img
											src="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png?v=c78bd457575a"
											alt=""
										/>
									</td>
									<td className="whitespace-nowrap px-6 py-4 font-medium">
										Stack Overflow
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										www.stackoverflow.com
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										11/06/23 10:24 PM
									</td>
									<td className="whitespace-nowrap px-6 py-4">
										11/06/23 10:24 PM
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PasswordTable;
