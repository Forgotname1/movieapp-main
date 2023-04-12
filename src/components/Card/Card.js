
import React, { useState, useContext } from 'react';
import { Card, Image, Tag, Typography, Rate } from 'antd';
import { format } from 'date-fns';
import { Context } from "../../context";

import service from "../../service/movie-db-api";

const { Meta, Grid } = Card;
const { Paragraph, Text, Title } = Typography;

export function CardItem({
                              id,
                              genre_ids,
                              title,
                              overview,
                              poster_path,
                              release_date,
                              vote_average,
                              rating,
                              ratedMessage,
                          }) {
    const genreContext = useContext(Context);

    const EllipsisMod = ({ children }) => {
        const text = children;
        return (
            <Paragraph
                ellipsis={{
                    rows: 5,
                }}
                height={129}
            >
                {text}
            </Paragraph>
        );
    };
    const desc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [rated, setRated] = useState(null);

    const editColor = (rate) => {
        if (rate > 0 && rate < 3) {
            return '#E90000';
        } else if (rate >= 3 && rate < 5) {
            return '#E97E00';
        } else if (rate >= 5 && rate < 7) {
            return '#E9D100';
        } else if (rate >= 7) {
            return '#66E900';
        }
    };
    const filterRanked = async (id, rated) => {
        if (rated > 0) {
            const sessionData = JSON.parse(localStorage.getItem('guest_session'));
            const { guest_session_id } = sessionData;
            await service.postRatedMovies(id, rated, guest_session_id).then((res) => ratedMessage(res));
        }
    };
    const renderGenres = (genre, genresList) => {
        const { genres } = genresList;
        let newGenres = [];
        if (genres) {
            newGenres = genres.filter((item) => item.id === genre);
        }
        return newGenres.map((item) => <Tag key={item.id}>{item.name}</Tag>);
    };
    console.log(title)
    return (

        <Card hoverable className="movieCard">
            <Grid>
                <Meta
                    className="movieCard_Meta"
                    title={
                        <>
                            {title && (
                                <>
                                    <Title level={5} className="movieCard_Title">
                                        {title}
                                    </Title>
                                    <Text className="movieCard_Text" style={{ border: `2px solid ${editColor(vote_average)}` }}>
                                        {Math.floor(vote_average * 10) / 10}
                                    </Text>
                                </>
                            )}
                        </>
                    }
                    description={
                        <>
                            <Text type="secondary">{release_date && format(new Date(release_date), 'MMMM d, yyyy')}</Text>
                            <Paragraph style={{ margin: 5, marginLeft: 0 }}>
                                {genre_ids && genre_ids.map((genre) => renderGenres(genre, genreContext))}
                            </Paragraph>
                            {overview && <EllipsisMod>{overview}</EllipsisMod>}
                            <Rate
                                tooltips={desc}
                                onChange={setRated}
                                value={rating || rated}
                                count={10}
                                style={{ fontSize: 14 }}
                                onClick={filterRanked(id, rated)}
                            />
                        </>
                    }
                    avatar={
                        <Image
                            src={
                                poster_path
                                    ? `https://image.tmdb.org/t/p/original${poster_path}`
                                    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                            }
                            width={153}
                            height={280}
                        />
                    }
                />
            </Grid>
        </Card>
    );
}
