import axios from "axios";
import { useEffect, useState } from "react";

interface Vehicle {
  vin: string;
  make: string;
  model: string;
  year: number;
}

export default function VinForm() {
  const [vin, setVin] = useState<string>("");
  const [isFetching, setIsFetching] = useState(false);
  const [history, setHistory] = useState<Vehicle[]>([]);

  const fetchHistory = async () => {
    const res = await axios.get<Vehicle[]>(`/api/vin`);
    console.log(res.data);
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin) {
      alert("Please input VIN number!");
      return;
    }
    if (isFetching) {
      alert("Please wait until the current submission is finished");
      return;
    }

    try {
      setIsFetching(true);
      const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesExtended/${vin}?format=json`;
      const { data } = await axios.get(apiUrl);

      const vehicleData = data?.Results[0];

      const make = vehicleData.Make;
      const model = vehicleData.Model;
      const year = parseInt(vehicleData.ModelYear);

      if (!make || !model || !year) {
        alert(`Couldn't find the vehicle with VIN - ${vin}`);
        return;
      }

      await axios.post(`/api/vin`, { vin, make, model, year });

      setVin("");
      fetchHistory();
    } catch (e) {
      console.error(e);
      alert(
        `Failed to submit - ${e instanceof Error ? e.message : "Uknown error"}`
      );
    } finally {
      setIsFetching(false);
    }
  };

  const getAge = (year: number) => new Date().getFullYear() - year;

  return (
    <div className="flex flex-col gap-4">
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter VIN"
          className="border p-2 flex rounded-md"
        />
        <button
          className={`${
            isFetching ? "pointer-events-none" : "cursor-pointer"
          } bg-blue-500 text-white px-4 py-2 rounded-md`}
          disabled={isFetching}
        >
          Lookup
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="">
            <th className="border p-2">VIN</th>
            <th className="border p-2">Make</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Age</th>
          </tr>
        </thead>
        <tbody>
          {history.map(({ vin, make, model, year }, idx) => (
            <tr key={idx}>
              <td className="border p-2">{vin}</td>
              <td className="border p-2">{make}</td>
              <td className="border p-2">{model}</td>
              <td className="border p-2">{getAge(year)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
