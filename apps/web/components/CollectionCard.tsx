import Image from 'next/image'

type Props = {
  title: string
  image: {
    url: string
    alt: string
  }
  tags: string[]
  available: number
  description: string
  actions: {
    name: string
    value: number
    action: () => any
    buttonName: string
  }[]
}

const CollectionCard = ({
  title,
  tags,
  available,
  actions,
  description,
  image: { alt, url },
}: Props) => (
  <div className="space-y-3 w-96 p-3 flex flex-col ring-1 ring-trueGray-900 rounded">
    <header className="flex gap-2 items-center">
      <Image src={url} alt={alt} width={50} height={50} />
      <h1 className="font-semibold text-lg">{title}</h1>
    </header>
    {/* TAGS */}
    <section className="flex gap-2">
      {tags.map((tag) => (
        <div
          key={tag}
          className="px-1.5 py-1 text-sm rounded ring-1 ring-trueGray-700 bg-trueGray-900"
        >
          {tag}
        </div>
      ))}
    </section>
    <section>
      <p>{description}</p>
    </section>
    {/* Availabe for Sale */}
    <section>
      <p>{available} available for Sale</p>
    </section>
    {/* ACTIONS */}
    <section>
      {actions.map(({ name, value, action, buttonName }) => (
        <div key={name} className="flex gap-7 justify-between items-center">
          <p className="font-bold">{name}</p>
          <p className="w-10">Ξ{value}</p>
          <button
            className="px-2.5 py-1 rounded ring-1 ring-trueGray-900 transition hover:bg-trueGray-900"
            onClick={action}
          >
            {buttonName}
          </button>
        </div>
      ))}
    </section>
  </div>
)

export default CollectionCard
