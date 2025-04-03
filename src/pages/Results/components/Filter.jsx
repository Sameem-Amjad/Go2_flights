import React from 'react'
import PriceRangeChart from "../../../charts/priceRange.jsx";

const Filter = () => {
  return (
    <div>
            <section className="flex justify-center items-center text-custom-green text-xl font-bold h-12 border-b border-b-[#525B31]">
              <p>Filter By</p>
            </section>
            <section className=" text-custom-green text-xl font-bold h-48 border-b border-b-[#525B31]">
              <PriceRangeChart />
            </section>
            <section className="text-custom-green h-[350px] border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Popular Filters</p>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> No
                  Prepayments
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Free
                  cancellations
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Book
                  without card
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Beach front
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Hotels
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> 1 star
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Resorts
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-4">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Guest
                  houses
                </div>
                <p>730</p>
              </div>
            </section>

            <section className="text-custom-green h-20 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Sustainablity</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Sustaiable Property 
                </div>
                <p>730</p>
              </div>
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Property Rating</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> 1 star 
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> 2 star 
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> 3 star 
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> 4 star 
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> 5 star 
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" /> Unrated 
                </div>
                <p>730</p>
              </div>
              
            </section>
            
            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Fun things to do</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Fitness center
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Bar
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Cinema
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Shopping mall
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Spa
                </div>
                <p>730</p>
              </div>              
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Cancelation policy</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>            
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Meals</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>              
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Cancelation policy</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>            
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Meals</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>              
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Cancelation policy</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>            
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Meals</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>              
            </section>

            <section className="text-custom-green h-62 border-b border-b-[#525B31] px-2 mt-2">
              <p className="font-semibold">Cancelation policy</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>            
            </section>
            <section className="text-custom-green h-62 px-2 mt-2">
              <p className="font-semibold">Meals</p>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>
              <div className="flex flex-row justify-between items-cente mt-5">
                <div className="h-5 flex items-center">
                  <input type="checkbox" className="w-5 h-5 mr-2" />  Demo
                </div>
                <p>730</p>
              </div>              
            </section>
    </div>
  )
}

export default Filter