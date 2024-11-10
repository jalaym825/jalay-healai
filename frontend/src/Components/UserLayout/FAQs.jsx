import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../UIs/shadcn-ui/accordion";
import { motion } from 'framer-motion';
import FAQ from '../../assets/faqs.svg';

const FAQs = () => {
    const faqs = [
        { question: "What is telemedicine?", answer: "Telemedicine allows you to consult with healthcare professionals remotely via phone or video call, providing convenient access to medical care from anywhere." },
        { question: "How often should I get a general health checkup?", answer: "It is recommended to get a general health checkup annually or as advised by your healthcare provider, especially if you have any chronic conditions." },
        { question: "What should I do if I experience side effects from my medication?", answer: "If you experience side effects, contact your doctor immediately. Do not stop taking your medication without consulting a healthcare professional." },
        { question: "How can I maintain a healthy lifestyle?", answer: "Maintaining a healthy lifestyle includes eating a balanced diet, exercising regularly, getting enough sleep, staying hydrated, and avoiding tobacco and excessive alcohol consumption." },
        { question: "What is the best way to manage stress?", answer: "To manage stress, try techniques such as deep breathing exercises, meditation, physical activity, and seeking support from friends, family, or a mental health professional." }
    ];
    return (
        <>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-8 h-8 md:w-16 md:h-16 border-2 border-red-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-16 left-1/4 w-12 h-12 md:w-24 md:h-24 border-2 border-red-500 rounded-full animate-bounce"></div>
                <div className="absolute top-40 right-20 w-8 h-8 md:w-16 md:h-16 border-2 border-red-300 rounded-full animate-ping"></div>
            </div>
            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 md:mb-20"
                >
                    <h1 className="inline-block text-4xl md:text-5xl font-dm-sans font-bold text-black mb-4 md:mb-6 relative">
                        FAQs
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0"></div>
                    </h1>
                    <div className="flex flex-col-reverse md:flex-row w-full">
                        <div className="font-dm-sans w-full md:w-[60%] mx-auto space-y-4 p-4 md:p-7">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-b mb-4 border-teal-500/30">
                                        <AccordionTrigger
                                            className="text-left py-4 px-4 md:px-6 bg-teal-500 rounded-t-lg hover:no-underline transition-colors duration-200"
                                        >
                                            <span className="text-base md:text-lg font-semibold text-white">{faq.question}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-4 md:p-6 text-start bg-teal-400 rounded-b-lg">
                                            <p className="text-white">{faq.answer}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                        <div className="w-full md:w-[40%] p-5">
                            <img src={FAQ} alt="FAQs" className="w-full h-auto" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default FAQs;
