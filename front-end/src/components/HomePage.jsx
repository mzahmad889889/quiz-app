import React from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {

    const navigate = useNavigate()
    return (
        <div className='w-full font-system-ui h-screen bg-[#003d39]'>
            <div className='h-18 bg-white shadow-lg w-[100%] px-15 m-auto justify-between flex items-center'>

                <a  href="/" className='text-2xl text-[#003d39] font-bold font-mono'>SMARTQUIZ</a>
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

            <div className='w-[100%] text-white h-[90%] bg-[#003d39] flex item-center m-auto justify-center gap-8 pt-10 pb-10'>
                <div className='w-[50%] p-15 '>
                    <h1 className='text-4xl font-semibold mb-5'>Welcome to  SmartQuiz</h1>

                    <h2 className='text-3xl font-semibold mb-6 '>Test Your knowledge</h2>

                    <p className='text-lg leading-[2rem] mb-8'>Welcome to SmartQuiz — a personalized space designed to help you manage your learning effortlessly. Here, you can view all the quizzes assigned to you, check their details such time limit, and number of questions, and start any quiz with just one click. You can also see your completed quizzes and track your progress over time. SamrtQuiz is clean, simple, and focused on providing you with everything you need to stay prepared, stay organized, and perform your best. Ensuring a secure and fully personalized experience every time you use the app.</p>

                    <button className='w-40 h-13 bg-white cursor-pointer text-xl font-bold rounded-xl text-black hover:bg-[#74EE66] hover:text-[#003d39] transition duration-200 ease-in' > Learn More</button>
                </div>

                <div className='w-[58%]'>
                    <img className='w-[93%] mt-10 rounded-3xl shadow-xl' src="https://thumbs.dreamstime.com/b/illustration-online-test-concept-education-questionnaire-form-survey-metaphor-answering-internet-quiz-homework-assignment-362437988.jpg" alt="online-test pic" />
                </div>
            </div>

        </div>
    )
}

export default HomePage