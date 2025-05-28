import React from "react";
import { Link } from 'react-router-dom';
import { Card, Col, Row, Spin } from 'antd';
import axios from 'axios';
import { Base64 } from 'js-base64';
import { LoadingOutlined } from '@ant-design/icons';

// import articles from './data/articles.json';
import { api } from '../common/http-common';


const Article = () => {
    const [loading, setLoading] = React.useState(true);
    const [articles, setArticles] = React.useState(null);
    React.useEffect(() => {
        const username = 'alice';
        const password = 'alice';
        // const access_token = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
        const access_token = Base64.encode(`${username}:${password}`);
        const url = api.uri+'articles';
        axios.get(url, {
            headers:{
                'Authorization': `Basic ${access_token}`
            }
        }).then((res) => {
            setArticles(res.data);
        }).then(()=>{setLoading(false)})
    }, []);

    if(loading){
        const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />
        return(<Spin indicator={antIcon} />);
    }else{
        if(!articles){
            return(
                <div> There is no article available now.</div>
            )
        }else{
            return (
                <Row justify="space-around">
                    {
                        articles && articles.map(({ id, title, fullText }) => (
                            <Col span={8} key={id} >
                                <Card title={title} style={ {width: 300 }} >
                                    <p>{fullText}</p>
                                    <p></p>
                                    <Link to={`/a/${id}`}>Details</Link>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            )
        }
    }
    
} 

export default Article;