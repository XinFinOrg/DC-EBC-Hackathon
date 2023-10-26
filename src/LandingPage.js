import React from "react";
import { useEffect, useState } from 'react';
import UserWalletSetup from './components/UserWalletSetup';

function LandingPage() {
    return (


<div>



<section className='relative overflow-hidden'>
  <div className='py-20 md:py-28'>
    <div className='container px-4 mx-auto'>
      <div className='flex flex-wrap xl:items-center -mx-4'>
        <div className='w-full md:w-1/2 px-4 mb-16 md:mb-0 justify-center text-center'>
        <h1 className="text-4xl font-semibold mb-4">Welcome to our Wall3t</h1>
  <p className="text-lg">Explore the world of finance with us.</p>

  
  <UserWalletSetup/>
        </div>
        <div className='w-full md:w-1/2 px-4'>
          <div className='relative mx-auto md:mr-0 max-w-max  float-right'>
          <div className="flex justify-center items-center">
                            <img src="/images/walletdemo.png" alt="wallet demo" className="max-w-sm text-center" />
                        </div>
                        <p className='-mt-4 -ml-6 text-center'>*Not Actuall Wallet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



        <section className='relative overflow-hidden'>
  <div className='py-20 md:py-28'>
    <div className='container px-4 mx-auto'>
      <div className='flex flex-wrap xl:items-center -mx-4'>
        <div className='w-full md:w-1/2 px-4 mb-16 md:mb-0 justify-center text-center'>
          <span className='inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-[#403F30] uppercase rounded-9xl'>
            Problem
          </span>          
          <div className='flex flex-wrap'>
            <div className='w-full md:w-auto py-1 md:py-0 md:mr-4'>
            <p className='mb-8 text-lg md:text-xl mx-10  font-medium text-justify'>
            Managing the legacy of crypto assets can pose significant challenges and risks due to the limitations and uncertainties associated with crypto wallets. Users often encounter difficulties when attempting to ensure the secure transfer of their assets to beneficiaries in the event of unforeseen circumstances, such as their physical absence or passing. Wall3t.finance is dedicated to addressing these concerns by offering an efficient, secure, and user-friendly solution.

          </p>
            </div>
          </div>
        </div>
        <div className='w-full md:w-1/2 px-4'>
          <div className='relative mx-auto md:mr-0 max-w-max'>
          <div className='relative w-5/6 h-auto justify-center text-center overflow-hidden float-right rounded-xl'>
  <img
    className='w-full h-full justify-center object-cover object-center'
    src='/images/Problem.png'
    alt=''
  />
</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className='relative overflow-hidden'>
  <div className='py-20 md:py-28'>
    <div className='container px-4 mx-auto'>
      <div className='flex flex-wrap xl:items-center -mx-4'>        
        <div className='w-full md:w-1/2 px-4'>
          <div className='relative mx-auto md:mr-0 max-w-max'>
          <div className='relative w-5/6 h-auto justify-center text-center overflow-hidden float-left rounded-xl'>
  <img
    className='w-full h-full justify-center object-cover object-center'
    src='/images/Solution.png'
    alt=''
  />
</div>
          </div>
        </div>

        <div className='w-full md:w-1/2 px-4 mb-16 md:mb-0 justify-center text-center'>
          <span className='inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-[#403F30] uppercase rounded-9xl'>
            Solution
          </span>          
          <div className='flex flex-wrap'>
            <div className='w-full md:w-auto py-1 md:py-0 md:mr-4'>
            <p className='mb-8 text-lg md:text-xl mx-10  font-medium text-justify'>
            Wall3t.finance utilizes smart contracts, and account abstraction technology to secure and help manage users’ crypto assets succession process. It is built on the XDC Network, making it top secure, transparent and future-proof.


          </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</section>


<section
          className='py-24 overflow-hidden'>
          <div className='container px-4 mx-auto'>
            <div className='md:max-w-4xl mb-4 md:mb-4'>
              <span className='inline-block py-px px-2 text-xs leading-5 text-white bg-[#403F30] font-medium uppercase rounded-full shadow-sm'>
              Key Featureas
              </span>             
            </div>
            <div className='flex flex-wrap lg:items-center -mx-4'>
              <div className='w-full md:w-1/2 px-4 mb-8 md:mb-0'>
                <div className='flex flex-wrap p-8 text-left md:text-left rounded-md transition duration-200'>                 
                  <div className='w-full md:flex-1 md:pt-3'>                        
                    <h4 className='text-black pl-4 font-medium'>
                   - Multi-wallet support.


                    <br/>
                    <br/>

                    - Unlimited wallets support per contract.


                    <br/>
                    <br/>

                    - User-friendly onboarding process.


                    <br/>
                    <br/>

                    - Intuitive interface.

                    <br/>
                    <br/>

                    - 24/7 Customer support.

                    <br/>
                    <br/>

                    - Fully customizable security level.


                    <br/>
                    <br/>

                    - Customizable time-sensitive approval process.


                    <br/>
                    <br/>

                    - Simplified asset management.


                    <br/>
                    <br/>

                    - Tiered wallet access. 


                    <br/>
                    <br/>

                    - Telegram bot notifications system reporting every action (customizable).


                    <br/>
                    <br/>

                    - Optional external transaction surveillance.

                    <br/>
                    <br/>

                    - Fast and low-cost transactions on XDC.

                   
                    </h4>             
                  </div>
                </div>                         
                </div>             
              <div className='w-full md:w-1/2 px-4'>
                <div className='relative mx-auto md:mr-0 max-w-max'>               
                  <img
                    src='/images/Crypto Wallet.png'
                    alt=''
                  />
                </div>
              </div>
            </div>
          </div>
        </section>       

        <section className='relative overflow-hidden'>
  <div className='py-20 md:py-28'>
    <div className='container px-4 mx-auto'>
      <div className='flex flex-wrap xl:items-center -mx-4'>
        <div className='w-full md:w-1/2 px-4 mb-16 md:mb-0 justify-center text-center'>
          <span className='inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-[#403F30] uppercase rounded-9xl'>
            Telegram Bot
          </span>          
          <div className='flex flex-wrap'>
            <div className='w-full md:w-auto py-1 md:py-0 md:mr-4'>
            <p className='mb-8 text-lg md:text-xl mx-10  font-medium text-justify'>
            With our telegram bot you can interact with the deployed smart wallet 
            <br/>
            <br/>

... Link ...
<br/>
<br/>

Aprove, reject, execute transactions directly on the phone using wall3t.finance services
          </p>
            </div>
          </div>
        </div>
        <div className='w-full md:w-1/2 px-4'>
          <div className='relative mx-auto md:mr-0 max-w-max'>
          <div className='relative w-5/6 h-auto justify-center text-center overflow-hidden float-right rounded-xl'>
  <img
    className='w-full h-full justify-center object-cover object-center'
    src='/images/TelegramBot.png'
    alt=''
  />
</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



        </div>
    );
}

export default LandingPage;