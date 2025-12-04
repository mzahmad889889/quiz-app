import React from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {

    const navigate = useNavigate()
    return (
        <div className='w-full font-system-ui h-screen bg-[#003d39] pt-6'>
            <div className='h-18 bg-white rounded-3xl shadow-lg w-[90%] px-5 m-auto justify-between flex items-center'>
                <h1 className='text-2xl text-[#003d39] font-bold font-mono '>QUIZ</h1>
                <div className='flex items-center gap-4'>
                    <button
                        type='button'
                        onClick={() => navigate('/login')}
                        className='w-25 h-10  cursor-pointer bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in'>Sign-In</button>
                    <button
                        type='button'
                        onClick={() => navigate('registration')}
                        className='w-25 h-10  cursor-pointer bg-[#003d39] text-white text-lg font-bold rounded-2xl hover:bg-[#74EE66] hover:text-black transition duration-200 ease-in'>Sign-Up</button></div>
            </div>

            <div className='w-[90%] h-[80%] bg-white rounded-2xl flex item-center m-auto justify-center gap-10 mt-10 pt-10 pb-10'>
                <div className='w-[50%] p-15 '>
                    <h1 className='text-5xl font-semibold mb-5 text-[#003d39] '>Welcome to Online Quiz</h1>

                    <h2 className='text-4xl text-[#003d39] font-semibold mb-8 '>Test Your knowledge</h2>

                    <p className='text-lg text-[#003d39] leading-[2rem] mb-8'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga voluptatum aliquid officiis. Facere laboriosam blanditiis maiores sed? Fuga sit ipsam ducimus consequatur tempora saepe modi possimus nulla quis animi, non accusantium in sequi dolorum quas hic ab consectetur minima nesciunt?</p>

                    <button className='w-40 h-13 bg-[#003d39]  cursor-pointer text-xl font-bold rounded-xl text-white hover:bg-[#74EE66] hover:text-black  transition' > Learn More</button>
                </div>

                <div className='w-[58%]'>
                    <img className='w-[93%] rounded-3xl shadow-xl' src="https://thumbs.dreamstime.com/b/illustration-online-test-concept-education-questionnaire-form-survey-metaphor-answering-internet-quiz-homework-assignment-362437988.jpg" alt="online-test pic" />
                </div>
            </div>

        </div>
    )
}

export default HomePage