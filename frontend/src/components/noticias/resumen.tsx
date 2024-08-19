interface Props {
  summary: string | undefined;
}
const Resumen = ({ summary }: Props) => {
  return (
    <div className="w-full p-4 bg-sig-gray2 rounded-xl">
      <h3 className="font-lora font-semibold text-sig-blue">Resumen</h3>
      <br />
      <p className="text-sm font-regular">{summary}</p>
    </div>
  );
};

export default Resumen;
