

const SidePage = () => {
  return (
    <div className=" md:flex flex-col justify-center items-center hidden  w-1/2 h-screen bg-[#242830] p-10">
      <div className="flex flex-row justify-center items-center gap-2 h-20">
        <img src="src/assets/logo.png" alt="" className="h-15" />
        <h1 className="text-4xl font-bold mb-4 pt-4 text-white">Sense AI</h1>
      </div>
      <p className="text-lg font-semibold mb-4 text-white text-center">
        "This plateform has transformed how we handle <br /> our busines
        processes. it's simply amazing!"
      </p>
      <p className="text-xl font-semibold text-white">Sofia devis</p>
    </div>
  );
};

export default SidePage;
