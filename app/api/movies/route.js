
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const query = `
    SELECT ?movie ?title ?date ?image ?imdb ?directorName ?description
    WHERE {
      ?movie wdt:P31 wd:Q11424;
             wdt:P345 ?imdb;
             wdt:P18 ?image;
             wikibase:sitelinks ?links.

      ?movie rdfs:label ?title.
      FILTER(LANG(?title) = "en")

      OPTIONAL {
        ?movie wdt:P577 ?date.
      }

      OPTIONAL {
        ?movie wdt:P57 ?director.
        ?director rdfs:label ?directorName.
        FILTER(LANG(?directorName) = "en")
      }

      OPTIONAL {
        ?movie schema:description ?description.
        FILTER(LANG(?description) = "en")
      }
    }
    ORDER BY DESC(?links)
    LIMIT 100
  `;

  try {
    const url =
      "https://query.wikidata.org/sparql?query=" +
      encodeURIComponent(query) +
      "&format=json";

    const response = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "MovieHubNextJS/1.0"
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error("Movie data service unavailable");
    }

    const data = await response.json();

    const movies = data.results.bindings.map((item) => ({
      id: item.movie.value.split("/").pop(),
      title: item.title.value,
      year: item.date?.value?.substring(0, 4) || "Unknown",
      poster: item.image.value.replace("http://", "https://"),
      director: item.directorName?.value || "Unknown",
      description: item.description?.value || "No description available",
      imdb: "https://www.imdb.com/title/" + item.imdb.value
    }));

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

