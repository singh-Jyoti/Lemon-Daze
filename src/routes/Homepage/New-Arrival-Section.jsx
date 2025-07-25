import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GlobalApi from "../../Api/GlobalApi";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/authContext";
import "./New-Arrival-Section.css"
import { GiAirplaneArrival } from "react-icons/gi";
import { useNavigate } from "react-router";

function NewArrival() {
    const [products, setProducts] = useState([]);
    const [addingToCartId, setAddingToCartId] = useState(null);
    const user = useContext(authContext);
    const navigate = useNavigate();
    useEffect(() => {
        GlobalApi.getAllProduct()
            .then((res) => setProducts(res.data.products))
            .catch((err) => console.error("Failed to fetch", err));
    }, []);

    function AddToCart(productId) {
        if (!user?.user?.user?._id) {
            alert("Please login to add product to cart");
            navigate("/login");
            return;
        }
        setAddingToCartId(productId);
        const data = {
            userId: user.user.user._id,
            productId: productId,
        }
        GlobalApi.AddToCart(data)
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                alert("Failed to add product to cart")
                console.log(err);
            }).finally(() => {
                setAddingToCartId(null);
            });
    }
    return (
        <div className="xs:mx-10 sm:mx-20 p-4">
            <div className="text-3xl cursive flex gap-3 py-7 my-5 justify-center items-center"><GiAirplaneArrival />New Arrivals <hr className="w-[78%] h-[10px] m-3" /></div>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                navigation

                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                    1280: {
                        slidesPerView: 5,
                    },
                }}
                className="custom-swiper"
            >
                {products.slice(0, 7).map((item) => (
                    <SwiperSlide key={item._id}>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                            <div className="relative group">
                                <img
                                    src={`https://lemon-daze-backend-production.up.railway.app${item.image}`}
                                    alt={item.name}
                                    className="w-full h-72 object-cover rounded-2xl hover:opacity-50"
                                />
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    SALE
                                </span>

                                {/* Hover button */}
                                <button
                                    onClick={() => AddToCart(item._id)}
                                    disabled={addingToCartId === item._id}
                                    className={`absolute invisible group-hover:visible top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
  border border-gray-700 text-gray-800 bg-white text-[10px] xs:text-sm hover:bg-gray-800 hover:text-opacity-70 
  hover:text-white font-semibold px-2 xs:px-4 py-2 rounded-full transition duration-300 
  ${addingToCartId === item._id ? "opacity-50 cursor-not-allowed" : "hover:border-gray-500"}`}

                                >
                                    {addingToCartId === item._id ? "Adding..." : "Add To Cart"}
                                </button>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                    {item.name}
                                </h2>
                                <p className="text-[12px] text-gray-600 mb-2">{item.description}</p>

                                <div className="flex gap-2 text-[14px] items-center mb-2">
                                    <p className="font-bold text-green-600">${item.price}</p>
                                    <p className="text-gray-500 line-through">${item.price + 500}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                ))}
            </Swiper>
        </div>

    )
}

export default NewArrival;

