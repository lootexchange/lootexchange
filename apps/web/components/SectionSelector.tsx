const SectionSelector = () => {
  const sections = [
    { name: 'Overview', action: () => console.log('Overview') },
    { name: 'Tokens', action: () => console.log('Tokens') },
    { name: 'LP Leaderboard', action: () => console.log('LP Leaderboard') },
  ]

  return (
    <div className="mb-4">
      <nav className="flex gap-4 max-w-screen-md mx-auto">
        {sections.map(({ name, action }) => (
          <button
            key={name}
            className="px-2 py-1 transition hover:bg-trueGray-900 rounded-t"
            onClick={action}
          >
            {name}
          </button>
        ))}
      </nav>
      {/* BORDER */}
      <div className="border-b-2 border-trueGray-900"></div>
    </div>
  )
}

export default SectionSelector
