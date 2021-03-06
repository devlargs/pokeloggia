import wiki from "wikijs";
import PokeApi from "constants/pokeApi";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

const PokemonById = ({ name, data = [] }) => {
  const { query } = useRouter();

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <div className="rounded rounded-t-lg overflow-hidden shadow max-w-xs my-3">
              <img
                src="https://tipsmake.com/data/thumbs/download-pokemon-wallpapers-download-pokemon-wallpaper-thumb-QmJUfttb2.jpg"
                className="w-full"
              />
              <div className="flex justify-center -mt-8">
                <img
                  src={`${query.imgUrl}`}
                  className="rounded-full border-solid border-red-600 border-4 -mt-3 h-32 w-32"
                />
              </div>
              <div className="text-center px-3 pb-6 pt-2">
                <h3 className="text-black text-lg bold font-sans mt-6">
                  {name}
                </h3>
                <p className="mt-2 font-sans font-light text-grey-dark">#1</p>
              </div>
              <div className="flex justify-center pb-3 text-grey-dark">
                <div className="text-center mr-3 border-r pr-3">
                  <span>Poison</span>
                </div>
                <div className="text-center">
                  <span>Grass</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-4 lg:col-span-2">
            {data.map((q: { title: string; content: string }) => {
              return (
                <dl className="space-y-12 mb-5" key={uuidv4()}>
                  <div>
                    <dt className="text-lg leading-6 font-medium text-gray-900">
                      {q.title}
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">
                      {q.content || "No data"}
                    </dd>
                  </div>
                </dl>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const data = await PokeApi.getPokemonsList(
    process.env.NODE_ENV === "development"
      ? {
          limit: 20,
          offset: 890,
        }
      : null
  );

  const paths = data.results.map((q: { name: string }) => ({
    params: {
      id: q.name,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // TODO - refactor and add sentry
  try {
    const { content } = await wiki().page(params.id);
    const data = await content();

    return {
      props: {
        name: params.id.split("-").join(" ").toUpperCase(),
        data,
      },
    };
  } catch (ex) {
    return {
      props: {
        name: params.id.split("-").join(" ").toUpperCase(),
        data: [],
        errored: true,
      },
    };
  }
}

export default PokemonById;
