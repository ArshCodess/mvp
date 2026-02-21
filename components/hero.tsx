import React from 'react'

function Hero() {
  return (
    <div className="inter min-h-screen overflow-x-hidden relative">

  <nav
    className="bg-amber-50 text-black absolute z-30 w-full m-2 mt-5 inset-x-0 rounded-4xl max-w-6xl mx-auto px-2 py-2 flex items-center justify-between">
    <div className="flex space-x-2 items-center ">
      <div className="rounded-full w-7 h-7 bg-purple-400"></div>
      <h1>NicePay</h1>
    </div>
    <div className="flex list-none justify-between gap-10">
      <li>Home</li>
      <li>Products</li>
      <li>Services</li>
      <li>Contact</li>
    </div>
    <button className="bg-purple-400 px-4 py-2 rounded-4xl text-white">
      Free Trial
    </button>
  </nav>

  <section className="bg-[#742ae3] border-[#f0e9fc] rounded-2xl border  mx-4 relative w-auto h-screen">

    <div
      className="rounded-bl-[20rem] rounded-br-[20rem] rounded-tl-none rounded-tr-none w-screen h-screen absolute bg-[#e7e6ea] blur-[60px] -top-[20%] m-auto z-20">
    </div>
    <div className=" rounded-full w-screen h-screen absolute bg-[#ebc271] blur-[80px] -top-[10%]  m-auto z-10"></div>

    <div className="relative z-30 flex flex-col items-center justify-end h-full text-center gap-10">
      <h1 className="text-black text-5xl/18 font-semibold ">Enhance your financial control <br/> with <span
          className="text-white font-normal from-[#742ae3] to-[#cfbfe6] bg-linear-0 rounded-2xl border-[#b98ff9] border px-4 py-">
          NicePay</span></h1>
      <div className="relative overflow-hidden w-[320px] h-[363px]" >
        <div className="relative w-[320px] h-[660px] bg-zinc-900 rounded-[3.5rem] p-3 shadow-2xl border-[3px] border-zinc-800">
          <div  className="absolute inset-1 border border-white/10 rounded-[3.2rem] pointer-events-none z-10"></div>
          <div className="relative w-full h-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col shadow-inner">
            <div className="h-12 w-full flex items-center justify-center px-8 -translate-y-1">
              <div className="absolute left-10 text-[12px] font-bold text-black">9:41</div>

              {/* <!-- 2026 Narrow Dynamic Island --> */}
              <div className="bg-black w-20 h-6 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-900/50 rounded-full absolute right-7 border border-white/10"></div>
              </div>
              <div className="absolute right-10 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="black" viewBox="0 0 24 24">
                  <path d="M12 21l-12-18h24z" />
                </svg>
                <div className="w-5 h-2.5 border border-black/40 rounded-[2px] p-[1px]">
                  <div className="h-full w-full bg-black rounded-[1px]"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center pt-24 px-8 text-center">
              <div
                className="w-16 h-16 bg-zinc-50 rounded-3xl mb-6 flex items-center justify-center shadow-sm border border-zinc-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400"></div>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">iPhone 17</h1>
              <p className="text-sm text-zinc-500 mt-2 font-medium leading-relaxed">
                Experience the thinnest <br/> display technology yet.
              </p>
            </div>
          </div>
          <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-zinc-700 rounded-l-sm border-r border-black/20"></div>
          <div className="absolute -left-[3px] top-36 w-[3px] h-14 bg-zinc-700 rounded-l-sm border-r border-black/20"></div>
          <div className="absolute -right-[3px] top-44 w-[3px] h-20 bg-zinc-700 rounded-r-sm border-l border-black/20">
          </div>
        </div>
      </div>
    </div>



  </section>
  </div>
  )
}

export default Hero;