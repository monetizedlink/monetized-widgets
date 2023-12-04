/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				BLACK: {
					10: '#F7F8FA',
					20: '#E6E8EB',
					30: '#D2D3D4',
					40: '#C5C6C7',
					50: '#A4A7AB',
					60: '#73777D',
					70: '#4D545E',
					80: '#323945',
					100: '#1E2023',
				},
				GREEN: {
					5: '#C9F2D7',
					50: '#15854D',
					100: '#06472D',
				},
				BLUE: {
					5: '#C0CEFA',
					50: '#453BCC',
					100: '#241E69',
				},
				RED: {
					5: '#F6E2E2',
					50: '#EB0000',
					100: '#800000',
				},
				LAVENDER: '#7870E0',
				VIOLET: '#BA94F5',
				SEAFOAM: '#B8D8CB',
				YELLOW: '#F0F35C',
				FROST: '#F2F8FA',
				IVORY: '#FCF9EF',
			},
		},
	},
	plugins: [],
};
