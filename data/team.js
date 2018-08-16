export const users = [
	{
		name: 'Andrej',
		id: 1,
		ids: {
			gl: 13,
			rm: 241,
		},
	},
	{
		name: 'Radek',
		id: 2,
		ids: {
			gl: 8,
			rm: 168,
			td: 659514,
		},
	},
	{
		name: 'Jany',
		id: 3,
		ids: {
			gl: 14,
			rm: 5,
		},
	},
	{
		name: 'Ondra',
		id: 4,
		ids: {
			gl: 3,
			rm: 129,
			td: 523967,
		},
	},
	{
		name: 'Dan',
		id: 5,
		ids: {
			gl: 17,
			rm: 217,
		},
	},
	{
		name: 'Tomas',
		id: 6,
		ids: {
			gl: 4,
			rm: 149,
		},
	},
	{
		name: 'Peter T',
		id: 7,
		ids: {
			gl: 6,
			rm: 193,
		},
	},
	{
		name: 'Marek',
		id: 8,
		ids: {
			gl: 9,
			rm: 219,
		},
	},
	{
		name: 'Milan',
		id: 10,
		ids: {
			gl: 11,
			rm: 229,
		},
	},
	{
		name: 'Ann',
		id: 9,
		ids: {
			gl: 10,
			rm: 226,
		},
	},
]
export const statuses = {
	todo: {
		gl: 3,	// To Do
		rm: 1,	// Nový
	},
	progress: {
		gl: 4,	// Progress
		rm: 2,	// Ve vývoji
	},
	test: {
		gl: 5,	// Test
		rm: 8,	// Testování
	},
	ready: {
		gl: 8,	// Ready to deploy
		rm: 9,	// Připraveno k nasazení
	},
	deploy: {
		gl: 6,	// Deploy
		rm: 3,	// Vyřešený
	},
	idle: {
		gl: 7,	// Čeká
		rm: 4,	// Čeká se
	},
	closed: {
		rm: 5,	// Uzavřený
	},
}
export const systems = {
	redmine: {
		allowedIssueStatuses: [
			statuses.todo.rm,
			statuses.progress.rm,
			statuses.test.rm,
			statuses.ready.rm,
			statuses.deploy.rm,
			statuses.idle.rm,
			statuses.closed.rm,
		],
		// auth: '404f76820130f2287b95cfcbff149be28f1daa12',	//admin api klic
		auth: '3135546c8e97570c179097d2b65738a20368bfc1',	//muj api klic
		issueUrl: 'http://rm.udiv.eu/issues/',
		projectId: 15, // Footshop.cz
		url: 'http://rm.udiv.eu/',
	},
	gitlab: {
		apiUrl: 'https://git.footshop.cz/api/v4/',
		apiProjectUrl: 'https://git.footshop.cz/api/v4/projects/2/',
		auth: '-HRjUUtjim76Pk2xJnT4',
		issueUrl: 'https://git.footshop.cz/footshop/footshop-ng/issues/',
		projectId: 2,	// footshop-ng
		projectUrl: 'https://git.footshop.cz/footshop/footshop-ng/',
		mergeRequestUrl: 'https://git.footshop.cz/footshop/footshop-ng/merge_requests/',
		url: 'https://git.footshop.cz/',
	},
	timedoctor: {
		// auth: 'M2I1NTU2MWIyZTkzNGViZGJkMDM3YzBlZmZkYjQxY2MxNTA5ZTlkNWQ5ZjIzMWMxMGEyYjljODk4YmE4OGEwMA', //milosh
		// projectId: 883939, // Footshop REST
		// projectId: 440915, // Footshop.com
		auth: 'YzRjM2E5OTM4YWY2MjcwMDRmZjEzNGNmZDU4YmJmZWZlM2RmYzQ5ZjU3OTMyZTc4OThkOTRjZTMxMDA4ZjkyNA',
		companyId: 257766, // Footshop s.r.o.
		projectId: 157560, // Footshop.cz
		url: 'https://webapi.timedoctor.com/v1.1/',
	},
}
export const ItemTypes = {
	BOARD: 'board'
}
export const GIT = {
	main_branch: 'master'
}