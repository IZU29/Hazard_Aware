import ScrollReveal from './ScrollReveal'
import ThemeToggle from './toggleTheme'
import './App.css'
import {useState} from 'react'
import { Link } from 'react-router-dom';

const AdvertBox =  () => {
  return(
    <div className=" lg:px-12 flex my-6 justify-center w-full">
      <div className="bg-[#111111] lg:w-[80%] rounded-full py-3 px-1 shadow-pop">
        <p className="text-white text-center lg:text-sm text-xs">Be among the first to see Custovvia in action, talk to sales today!</p>
      </div>
    </div>
  )
}

const NavBar = () => {
  return (
    <div className="flex lg:px-16 lg:my-8 justify-between px-4">
      <div className="lg:w-[80%] flex items-center ">
        {/* <img src="custovvia_logo.svg" alt="" className="" /> */}
        <p className="font-bold text-xl">HazardAware</p>
      </div>
      <div className="lg:w-[30%] flex justify-between ">
        <ThemeToggle />
        {/* <button className="text-[#0040C1] tracking-tight mx-2">Book a Demo</button> */}
        <button className="bg-[#155EEF] text-white py-2 px-6 rounded-md"><a href="https://custovvia.com/login" className="">Log in</a></button>
      </div>
    </div>
  )
}
const FirstContainer = () => {
  return(
    <div className="lg:px-16 lg:w-[70%] py-16 px-4 m-auto">
    <h1 className="lg:text-[42px] my-4 font-semibold text-center">Turn Sensor Telemetry Into Actionable Hazard Intelligence</h1>
    <p className=" my-4 text-center text-[18px]">Help safety and operations teams monitor environmental risks, detect hazards in real time, automate alerts, and protect personnel from a single unified platform.</p>
    <div className="flex my-4 lg:w-[40%] m-auto justify-center">
        <button className="bg-[#155EEF] text-white py-2 px-6 rounded-md mx-2">Log in</button>
      </div>
    </div>
  )
}

const Screenshot = () => {
  return(
    <div className="w-[90%] lg:px-16 lg:py-16 py-8 px-4 mask-[linear-gradient(to_bottom,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_100%)] m-auto">
      <img src="background_screenshot.png" alt="" className="border border-[#DCDFEA] rounded-lg" />
    </div>
  )
}

const Statistics = () => {
  return(
    <div className="lg:px-16 lg:py-32 py-8 flex flex-col px-4">
      <h1 className="m-auto text-3xl font-semibold lg:w-[60%] text-center lg:text-[36px]">Join Organizations and Individuals Build a Safer Work and Domestic Environment</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 py-12 justify-between gap-x-4">
        <div className="">
          <h3 className="text-3xl font-semibold py-4 text-center">5+</h3>
          <p className="text-[#4A5578] text-center">Hazard Detection Signals</p>
        </div>
        <div className="">
          <h3 className="text-3xl font-semibold py-4 text-center">1s</h3>
          <p className="text-[#4A5578] text-center">Instant Threshold & Alert Latency</p>
        </div>
        <div className="">
          <h3 className="text-3xl font-semibold py-4 text-center">24/7</h3>
          <p className="text-[#4A5578] text-center">Real-Time Telemetry & Monitoring</p>
        </div>
        <div className="">
          <h3 className="text-3xl font-semibold py-4 text-center">1</h3>
          <p className="text-[#4A5578] text-center">Centralized Hazard Control Center</p>
        </div>
      </div>
    </div>
  )
}

const Features = () => {
  return(
    <div className="lg:px-16 py-16 px-4">
      <div className="flex flex-col">
      <h4 className="text-center text-[#155EEF] text-sm py-6">Features</h4>
      <h1 className="m-auto text-3xl font-semibold text-center py-6">Everything You Need to Monitor, Detect, and Prevent Hazards</h1>
      <p className="text-[#30374F] py-8 lg:w-1/2 m-auto text-center">Understand environmental risks, spot abnormal sensor telemetry early, and trigger automated emergency protocols before critical incidents occur.</p>
      {/* </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-8 gap-x-10">
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] flex flex-col rounded-lg p-4">
          <div className=" m-auto dark:bg-black rounded-md">
          <img src="grid_image_1.svg" alt="" className="dark:opacity-80" />
          </div>
          <div className="">
          <h3 className="font-semibold text-xl py-2">Customer Management</h3>
          <p className="text-sm py-2">Centralize customer information, interactions, documents, and activity in a single workspace.</p>
          </div>
        </div>
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] flex flex-col rounded-lg p-4">
          <div className=" m-auto dark:bg-black rounded-md">
          <img src="grid_image_2.svg" alt="" className="dark:opacity-80" />
          </div>
          <div className="">
          <h3 className="font-semibold text-xl py-2">Customer Health Monitoring</h3>
          <p className="text-sm py-2">Track customer health in real time and identify risks before they impact retention.</p>
          </div>
        </div>
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] flex flex-col rounded-lg p-4">
          <div className=" m-auto dark:bg-black rounded-md">
          <img src="grid_image_3.svg" alt="" className="dark:opacity-80" />
          </div>
          <div className="">
          <h3 className="font-semibold text-xl py-2">Playbooks & Automation</h3>
          <p className="text-sm py-2">Automate customer success workflows and ensure consistent engagement at every stage.</p>
          </div>
        </div>
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] flex flex-col rounded-lg p-4">
          <div className=" m-auto dark:bg-black rounded-md">
          <img src="grid_image_4.svg" alt="" className="dark:opacity-80" />
          </div>
          <div className="">
          <h3 className="font-semibold text-xl py-2">Reports & Insights</h3>
          <p className="text-sm py-2">Turn customer data into actionable insights with clear and easy-to-understand reports.</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}
const Benefits = () => {
  return(
    <div className="flex flex-col lg:flex-row lg:px-16 py-16 items-center justify-between px-4">
      <div className="lg:w-[35%]">
        <h3 className="text-[#155EEF] text-sm py-6 text-center lg:text-left">Benefits</h3>
        <h1 className="text-3xl font-semibold text-center lg:text-left ">Built for Modern Customer Success Teams</h1>
      </div>
      <div className="lg:w-[60%] grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
        <div className="border border-[#DCDFEA] rounded-md p-4">
          <div className=" pb-10">
            <img src="reduce_customer.svg" alt="" className="" />
          </div>
          <div className="">
          <h3 className="font-semibold py-2">Mitigate Safety Risks</h3>
          <p className="text-[#5D6B98] py-2">Identify warning signs early and take immediate action to protect assets and personnel.</p>
          </div>
        </div>
        <div className="border border-[#DCDFEA] rounded-md p-4">
          <div className="pb-10">
            <img src="improve_team.svg" alt="" className="" />
          </div>
          <div className="">
          <h3 className="font-semibold py-2">Enhance Operational Safety</h3>
          <p className="text-[#5D6B98] py-2">Automate alert protocols and grant safety officers full visibility over monitored sites.</p>
          </div>
        </div>
        <div className="border border-[#DCDFEA] rounded-md p-4">
          <div className="pb-10">
            <img src="increase_customer.svg" alt="" className="" />
          </div>
          <div className="">
          <h3 className="font-semibold py-2">Improve Incident Response</h3>
          <p className="text-[#5D6B98] py-2">Streamline communication through real-time notifications and automated emergency workflows.</p>
          </div>
        </div>
        <div className="border border-[#DCDFEA] rounded-md p-4">
          <div className="pb-10">
            <img src="drive_revenue.svg" alt="" className="" />
          </div>
          <div className="">
          <h3 className="font-semibold py-2">Maintain Full Compliance</h3>
          <p className="text-[#5D6B98] py-2">Access complete logs and telemetry history to meet regulatory standards and audit requirements.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
const Testimonials = () => {
  return(
    <div className="flex flex-col py-8 lg:py-16 lg:px-16 px-4">
      <div className="lg:w-[55%] m-auto">
      <h3 className="text-center text-[#155EEF] text-sm py-4">Testimonials</h3>
      <h1 className="text-3xl font-semibold text-center m-auto py-4 lg:w-[80%]">Protecting Personnel and Assets Across Critical Environments</h1>
      <p className="text-center text-[#30374F] py-4">See how safety managers and site engineers rely on real-time hazard monitoring to maintain zero-incident workplaces.</p>
      </div>
      <div className="grid lg:grid-cols-4 gap-4 py-6">
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] rounded-md p-4 flex flex-col justify-between">            
          <p className="text-[#404968] dark:text-white pb-8">"The real-time threshold alert system completely changed our response protocol. We can pinpoint environmental risks instantly."</p>
          <div className="flex">
            <img src="sarah_johnson.png" alt="" className="" />
            <div className="flex flex-col">
              <h4 className="font-semibold mx-2">Utoh Samuel Somtochukwu Baba</h4>
              <p className="text-[#5D6B98] text-xs mx-2">Fnal Year Course Rep</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] rounded-md p-4 flex flex-col justify-between">
          <p className="text-[#404968] dark:text-white pb-8">"The danger scoring and telemetry trends give our safety officers clear visibility into site conditions."</p>
          <div className="flex">
            <img src="micheal_idowu.png" alt="" className="" />
            <div className="flex flex-col">
              <h4 className="font-semibold mx-2">Akabuike Daniel D.Trino</h4>
              <p className="text-[#5D6B98] text-xs mx-2">Final Year Course Rep</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] rounded-md p-4 flex flex-col justify-between">
          <p className="text-[#404968] dark:text-white pb-8">"Automated alert playbooks transformed our safety operations. Emergency contacts are notified in seconds."</p>
          <div className="flex">
            <img src="emily_roberts.png" alt="" className="" />
            <div className="flex flex-col">
              <h4 className="font-semibold mx-2">Ndukw Ebere Precious</h4>
              <p className="text-[#5D6B98] text-xs mx-2">Customer Experience Lead</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9F9FB] dark:bg-[#1e2d4d] rounded-md p-4 flex flex-col justify-between">
          <p className="text-[#404968] dark:text-white pb-8">"This System was effective enough to safeguard my home from pending fire outbreak due to the gas leakage while I was cooking my  sumptuos beans"</p>
          <div className="flex">
            <img src="femi_davis.png" alt="" className="" />
            <div className="flex flex-col">
              <h4 className="font-semibold mx-2">Chukwuwemeka Uzochukwu Update</h4>
              <p className="text-[#5D6B98] text-xs mx-2">The Electronic Engineer</p>
            </div>
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>
  )
}
const Get_Started = () => {
  return(
    <div className="py-8 lg:py-16 lg:px-16 px-4 ">
      <div className="relative flex overflow-hidden bg-[linear-gradient(28deg,rgba(2,0,36,1)_0%,rgba(33,33,97,1)_35%,rgba(0,0,0,1)_100%)] rounded-lg">
      <div className="flex flex-col lg:w-[55%] p-4">
        <h1 className="lg:text-3xl  my-4 text-white">Start Building Healthier Customer Relationships Today</h1>
        <p className=" my-4 text-white">Give your team the tools they need to retain customers, reduce churn, and unlock growth opportunities with confidence.</p>
        <div className="flex my-4 lg:w-[40%]">
        <button className="bg-[#155EEF] text-white py-2 px-6 rounded-md">Log in</button>
        <button className="text-white mx-2 border px-2 rounded-md">Book a Demo</button>
      </div>
      </div>
        <img src="Macbook_Image.png" alt="" className="absolute -bottom-10 -right-10 w-[40%]" />
      </div>
    </div>
  )
}
const Footer = () => {
  return (
    <div className="flex flex-col lg:w-[50%] m-auto py-16">
      <div className="flex m-auto items-center py-4">
        <div className="">
        <img src="custovvia_logo.svg" alt="" className="w-[40px]" />
        </div>
        <h1 className="font-bold text-4xl">Custovvia</h1>
      </div>
      <div className="flex m-auto lg:w-[30%] justify-between py-4">
        <img src="twitter.svg" alt="" className="mx-2"/>
        <img src="facebook.svg" alt="" className="mx-2"/>
        <img src="instagram.svg" alt="" className="mx-2"/>
        <img src="linkedin.svg" alt="" className="mx-2"/>
      </div>
      <div className="text-center py-4">
        <p className=""><span className="font-semibold ">Send Your Feedback :</span>hello@custovvia.com</p>
      </div>
      <div className="flex flex-col lg:flex-row justify-evenly items-center py-4">
        <Link to='/privacy' className="my-2 lg:border-r px-4 border-[#30374F] text-[#30374F] cursor-pointer">Privacy Policy </Link>
        <Link to='/data' className="my-2 lg:border-r px-4 text-[#30374F] cursor-pointer">Data Policy</Link>
        <Link to='/cookie' className="my-2 lg:border-r px-4 text-[#30374F] cursor-pointer">Cookie Notice</Link>
        <Link to='/terms' className="my-2 text-[#30374F] cursor-pointer">Terms & Conditions</Link>
      </div>
      <div className="m-auto">
        <p className="text-[#30374F]">© 2026 Custovvia. All rights reserved.</p>
      </div>
    </div>
  )
}
export default function Home() {
  return (
<div className="relative">
  <NavBar />
  <ScrollReveal>
  <FirstContainer />
  <Screenshot />
  </ScrollReveal>
  <ScrollReveal>
  <Statistics />
  </ScrollReveal>
  <ScrollReveal>
  <Features />
  </ScrollReveal>
  <ScrollReveal>
  <Benefits />
  </ScrollReveal>
  <ScrollReveal>
  <Testimonials />
  </ScrollReveal>
  <ScrollReveal>
  <Get_Started />
  </ScrollReveal>
  <ScrollReveal>
  <Footer />
  </ScrollReveal>
</div>
    
  )
}

