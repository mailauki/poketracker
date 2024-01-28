import Image from 'next/image'

export default function Home() {
  return (
		<div className="flex flex-col grow shrink-0 basis-4 justify-center items-center gap-2">
			<h1 className="text-5xl font-bold">PokéTracker</h1>
			<Image
				src="/pokeball.svg"
				alt="pokeball"
				width={140}
				height={140}
				className="dark:invert"
			/>
		</div>
  )
}
