import styled from "styled-components";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import StarRating from "@/components/StarRating";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";


const Title = styled.h2`
    font-size: 1.2rem;
    margin-bottom: 5px;   
`;

const Subtitle = styled.h3`
    font-size: 1rem;
    margin-top: 5px;
`;

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: 60px;
    }
`;

const ReviewWrapper = styled.div`
    margin-bottom: 20px;
    border-top: 1px solid #aaa;
    padding: 10px 0;
    h3 {
        margin: 3px 0;
        font-size: 1rem;
        font-weight: normal;
        color: #4cc9f0;
    }
    p {
        margin: 0;
        font-size: .7rem;
        color: #12086f;
    }
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    time{
        font-size: 12px;
        color: #6e9fc1;
    }
`;

export default function ProductReviews({product}) {
    const [title, setTitle] = useState('');
    const[desc, setDesc] = useState('');
    const [stars, setStars] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading,setReviewsLoading] = useState(false);
    function submitReview() {
        axios.post('/api/reviews', {
            title, desc, stars, product:product._id
        }).then(r => {
            setTitle('');
            setStars(0);
            setDesc('');
            loadReviews();
        })
    }

    function loadReviews () {
        setReviewsLoading(true);
        axios.get('/api/reviews?product='+product._id).then(r => {
            setReviews(r.data);
            setReviewsLoading(false);
        })
    }

    const AddReviewBox = styled(WhiteBox)`
    padding: 20px; // Add padding inside the box for more space
    // Other styles...
`;

    useEffect(() => {
        loadReviews();
    }, []);

    return(
        <div>
            <Title>Reviews</Title>
            <ColsWrapper>
                <div>
                    <AddReviewBox>
                        <Subtitle>Add a review</Subtitle>
                        <div>
                            <StarRating onChange={setStars}/>
                        </div>
                        <Input
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                            placeholder={"Title"}/>
                        <br/>
                        You can pull the review box as big as you want:
                        <TextArea
                            value={desc}
                            onChange={ev => setDesc(ev.target.value)}
                            placeholder={"Was your experience good?"}/>
                        <div>
                            <Button primary
                                    onClick={submitReview}
                            >Submit your review</Button>
                        </div>
                    </AddReviewBox>

                    <div>
                        <WhiteBox>
                            <Subtitle>All reviews</Subtitle>
                            {reviewsLoading && (
                                <Spinner fullWidth={true}/>
                            )}

                            {reviews.length === 0 && (
                                <p>Nothing...</p>
                            )}

                            {reviews.length > 0 && reviews.map(r => (
                                <ReviewWrapper>
                                    <ReviewHeader>
                                        <StarRating size={'sm'} disabled={true} defaultHowMany={r.stars}/>
                                        <time>Date: {(new Date(r.createdAt)).toLocaleString('sv-SE')}</time>
                                    </ReviewHeader>
                                    <h3>Title: {r.title}</h3> <br/>
                                    <p>{r.desc}</p>  <br/>
                                    <br/>
                                </ReviewWrapper>
                            ))}
                        </WhiteBox>
                    </div>

                </div>


            </ColsWrapper>
        </div>
    );
}