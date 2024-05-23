import { Inter } from "next/font/google";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import fileDownload from "js-file-download";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [artist, setArtist] = useState("");
  const [writeStyle, setWritingStyle] = useState("");
  const [phrases, setphrases] = useState("");
  const [lyricsStyle, setLyricsStyle] = useState("Chill");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isPending, setIsPending] = useState(false);

  function generatePDF() {
    setIsPending(true);

    axios
      .post('https://stage-uxebo.ondigitalocean.app/api/v1/pdf-generate/lyrics', {
        lyrics: result
      }, {
        responseType: "blob",
      })
      .then(async (response) => {
        fileDownload(response.data, 'lyrics.pdf');
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  const generate = async () => {
    try {
      setIsLoading(true);
      const body = {
        prompt: `Generate song script for singer, who want to sing the song, and singer's style  is ${lyricsStyle} ${
          phrases !== "" && "and use these info for generate song script."
        } writing style is: ${writeStyle} and artist name is ${artist}`,
      };

      const response = await fetch("/api/generate", {
        body: JSON.stringify(body, null),
        method: "POST",
      });
      const stream: any = response.body;

      // You can process the stream as needed, for example:
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder("utf-8").decode(value);
        console.log("Received chunk:", text);

        if (text.includes("END STREAMS")) {
        } else {
          console.log(text);
          setResult((result) => result + text);
        }
      }

      setphrases("");
      setLyricsStyle("Pop");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-wrap w-full mt-5">
      <div className="mb-5 px-4  w-full lg:w-6/12">
        <div className="bg-cyan-50 p-4 rounded-md">
          <div className="flex gap-4 items-center mb-2">
            <div className=" bg-cyan-500 rounded-full h-12 w-12 flex items-center justify-center">
              <div className="font-semibold text-white text-2xl">1</div>
            </div>
            <p className="mb-1 text-3xl font-extrabold">Artist</p>
          </div>

          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full border py-2 px-4 mb-2"
          />

          <div className="flex gap-4 items-center mb-2">
            <div className=" bg-cyan-500 rounded-full h-12 w-12 flex items-center justify-center">
              <div className="font-semibold text-white text-2xl">2</div>
            </div>
            <p className="mb-1 text-3xl font-extrabold">Writing Style</p>
          </div>

          <select onChange={(e) => setWritingStyle(e.target.value)} className="w-full border py-2 px-4 mb-2">
              <option>
                Happy
              </option>

              <option>
                Sad
              </option>
          </select>


          <div className="flex gap-4 items-center mb-2">
            <div className=" bg-cyan-500 rounded-full h-12 w-12 flex items-center justify-center">
              <div className="font-semibold text-white text-2xl">3</div>
            </div>
            <p className="mb-1 text-3xl font-extrabold">Select a vibe</p>
          </div>

          <div className="flex flex-wrap justify-between items-center mb-5 space-x-3 mt-5">
            <div
              onClick={() => setLyricsStyle("Chill")}
              className={`border-2 rounded-3xl h-28 items-center flex flex-col justify-center text-center shadow-lg cursor-pointer w-2/12 ${
                lyricsStyle === "Chill" ? "border-cyan-500" : ""
              }`}
            >
              <Image src="/chill-out.png" width={38} height={38} alt="Chill" />
              <p className="font-semibold text-sm lg:text-xl">Chill</p>
            </div>

            <div
              onClick={() => setLyricsStyle("Hip-Hop")}
              className={`border-2 rounded-3xl h-28 items-center flex flex-col justify-center text-center shadow-lg cursor-pointer w-2/12 ${
                lyricsStyle === "Hip-Hop" ? "border-cyan-500" : ""
              }`}
            >
              <Image src="/fire.png" width={38} height={38} alt="Hip-Hop" />
              <p className="font-semibold text-sm lg:text-xl">Hip-Hop</p>
            </div>

            <div
              onClick={() => setLyricsStyle("Electronic")}
              className={`border-2 rounded-3xl h-28 items-center flex flex-col justify-center text-center shadow-lg cursor-pointer w-2/12 ${
                lyricsStyle === "Electronic" ? "border-cyan-500" : ""
              }`}
            >
              <Image src="/robot.png" width={38} height={38} alt="robot" />
              <p className="font-semibold text-sm lg:text-xl">Electronic</p>
            </div>

            <div
              onClick={() => setLyricsStyle("Rock")}
              className={`border-2 rounded-3xl h-28 items-center flex flex-col justify-center text-center shadow-lg cursor-pointer w-2/12 ${
                lyricsStyle === "Rock" ? "border-cyan-500" : ""
              }`}
            >
              <Image src="/guitar.png" width={38} height={38} alt="rock" />
              <p className="font-semibold text-sm lg:text-xl">Rock</p>
            </div>

            <div
              onClick={() => setLyricsStyle("Dance")}
              className={`border-2 rounded-3xl h-28 items-center flex flex-col justify-center text-center shadow-lg cursor-pointer w-2/12 ${
                lyricsStyle === "Dance" ? "border-cyan-500" : ""
              }`}
            >
              <Image src="/dance.png" width={38} height={38} alt="dance" />
              <p className="font-semibold text-sm lg:text-xl">Dance</p>
            </div>
          </div>

          <div className="flex gap-4 items-center mb-2">
            <div className=" bg-cyan-500 rounded-full h-12 w-12 flex items-center justify-center">
              <div className="font-semibold text-white text-2xl">4</div>
            </div>
            <p className="mb-1 text-3xl font-extrabold">
              Enter a prompt <span className="font-light">(optional)</span>
            </p>
          </div>

          <textarea
            value={phrases}
            onChange={(e) => setphrases(e.target.value)}
            rows={5}
            className="w-full border py-2 px-4 mb-2"
          ></textarea>

          <button
            onClick={generate}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl w-full text-xl"
          >
            {isLoading ? "Please wait" : "Generate"}
          </button>
        </div>

        <p className="mt-5 text-2xl font-semibold border-t-2 border-b-2 p-2 border-dotted mb-5">
          Lyrics
        </p>
        <textarea onChange={(e) => setResult(e.target.value)} value={result} className="w-full p-4 border-2 border-dotted focus:outline-none" rows={20}  style={{ whiteSpace: "pre-wrap" }}/>


          <button
            onClick={generatePDF}
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl w-full text-xl"
          >
            {isLoading ? "Please wait" : "Download PDF"}
          </button>
      </div>
      <div className="mb-5 px-4 my-4 w-full lg:w-6/12">

      </div>
    </main>
  );
}
