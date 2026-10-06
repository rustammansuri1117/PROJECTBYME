import React from "react";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";

import Navbar from "./Component/Navbar";
import Hero from "./Component/Hero/Hero";
import HotelCard from "./Component/Hotel-Card/HotelCard";
import Form from "./Component/Formpage/Form";
import UpdateHotel from "./Component/UpdateHotel/UpdateHotel";
import DeleteHotel from "./Component/DeleteHotel/DeleteHotel";
import Footer from "./Component/Footer/Footer";

// The search filters live in the URL (/?search=...&location=...&maxPrice=...)
// so the navbar search, the hero search and page refreshes all stay in sync.
function Home() {
    const [params, setParams] = useSearchParams();

    const filters = {
        search: params.get("search") || "",
        location: params.get("location") || "",
        maxPrice: params.get("maxPrice") || "",
    };

    const handleSearch = (next) => {
        const query = {};
        Object.entries(next).forEach(([key, value]) => {
            if (value) query[key] = value;
        });
        setParams(query);
    };

    // `key` resets the inputs / page number whenever the filters change
    const filterKey = JSON.stringify(filters);

    return (
        <>
            <Hero key={filterKey} initial={filters} onSearch={handleSearch} />
            <HotelCard key={filterKey} filters={filters} />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Add Hotel */}
                <Route path="/add-hotel" element={<Form />} />

                {/* Update Hotel */}
                <Route path="/update-hotel" element={<UpdateHotel />} />

                {/* Delete Hotel */}
                <Route path="/delete-hotel" element={<DeleteHotel />} />

            </Routes>

            {/* Footer */}
            <Footer />

        </BrowserRouter>
    );
}

export default App;
