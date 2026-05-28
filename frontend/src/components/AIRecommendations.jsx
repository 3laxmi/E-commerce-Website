import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const AIRecommendations = () => {
  const { backendUrl, userId, token } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${backendUrl}/api/ai/recommendations`,
          { userId },
          { headers: { token } }
        );

        if (response.data.success) {
          setRecommendations(response.data.recommendations);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, token, backendUrl]);

  if (!recommendations.length || loading) return null;

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"RECOMMENDED"} text2={"FOR YOU"} />
      </div>
      <div className="product-grid">
        {recommendations.map((item, index) => (
          <ProductItem
            key={index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
