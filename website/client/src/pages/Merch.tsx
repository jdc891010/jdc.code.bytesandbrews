import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";

// Design assets from public/merch
const merchItems = [
    {
        id: "will-code-for-wifi",
        name: "Will Code for WiFi",
        image: "/merch/will_code_for_wifi_tee.svg",
        price: 350,
        description: "The digital nomad's motto. Wear it loud, wear it proud."
    },
    {
        id: "status-418",
        name: "Error 418: I'm a Teapot",
        image: "/merch/status_418_tee.svg",
        price: 350,
        description: "The classic HTCPCP response code. Only for the true brewed coffee connoisseurs."
    },
    {
        id: "my-brew-my-python",
        name: "My Brew, My Python",
        image: "/merch/my_brew_my_python_tee.svg",
        price: 350,
        description: "Sip coffee, write scripts. Ideally not at the same time on the keyboard."
    },
    {
        id: "no-brew-400",
        name: "400 Bad Request: Start Brew",
        image: "/merch/no_brew_400_tee.svg",
        price: 350,
        description: "When the server (barista) doesn't understand your order."
    },
    {
        id: "i-dont-byte",
        name: "I Don't Byte",
        image: "/merch/i_dont_byte_tee.svg",
        price: 320,
        description: "Friendly developer apparel. Safe for production."
    },
    {
        id: "u-int-cooler",
        name: "u_int Cooler Than You",
        image: "/merch/u_int_cooler_tee.svg",
        price: 320,
        description: "Unsigned integer logic for the coolest coders."
    },
    {
        id: "cool-down",
        name: "Cool Down For A Bit",
        image: "/merch/cool_down_for_a_bit_tee.svg",
        price: 320,
        description: "Take a break. Your CPU and your brain need it."
    }
];

const Merch = () => {
    return (
        <>
            <Helmet>
                <title>Merch | Brews and Bytes</title>
                <meta name="description" content="Official Brews and Bytes merchandise. Geeky tees for coffee-loving coders." />
            </Helmet>

            <section className="py-20 bg-soft-cream min-h-screen">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="text-center mb-16"
                    >
                        <motion.h1
                            variants={fadeIn("up")}
                            className="font-pacifico text-4xl md:text-5xl text-coffee-brown mb-4"
                        >
                            Wear Your Code
                        </motion.h1>
                        <motion.p
                            variants={fadeIn("up")}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            Premium threads mixed with binary beans. Designed for the intersection of caffeine and compilation.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {merchItems.map((item) => (
                            <MerchCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

const MerchCard = ({ item }: { item: typeof merchItems[0] }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={fadeIn("up")}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-2xl transition-shadow duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Mockup Area */}
            <div className="relative h-80 bg-gray-100 flex items-center justify-center overflow-hidden group">

                {/* Background Binary Effect (subtle) */}
                <div className="absolute inset-0 opacity-5 text-[10px] leading-tight overflow-hidden select-none pointer-events-none text-tech-blue font-mono">
                    {Array(100).fill("1010101 00101 11001 ").join(" ")}
                </div>

                {/* T-Shirt Base */}
                <div className="relative w-64 h-64 bg-gray-800 rounded-2xl shadow-inner flex items-center justify-center mask-t-shirt">
                    {/* We simulate a t-shirt shape and color here or use an image */}
                    <img
                        src="https://placehold.co/600x600/1e293b/png?text=\n"
                        alt="T-Shirt Base"
                        className="w-full h-full object-cover opacity-100" // Using a dark block as 'shirt' for now or better, a real placeholder if possible.
                    />

                    {/* Design Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <img
                            src={item.image}
                            alt={item.name}
                            className={`w-full max-h-40 object-contain transition-transform duration-500 ${isHovered ? 'scale-110 drop-shadow-[0_0_15px_rgba(64,196,255,0.5)]' : 'drop-shadow-sm'}`}
                        />
                    </div>

                    {/* Texture Overlay for "Realism" */}
                    <div className="absolute inset-0 bg-black opacity-10 mix-blend-multiply pointer-events-none"></div>
                </div>

            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-coffee-brown">{item.name}</h3>
                    <span className="font-mono text-tech-blue font-bold">R{item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-6 flex-grow">{item.description}</p>

                <div className="mt-auto">
                    <Button className="w-full bg-coffee-brown hover:bg-vibe-yellow hover:text-coffee-brown transition-colors">
                        Add to Cart <i className="fas fa-shopping-cart ml-2"></i>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default Merch;
