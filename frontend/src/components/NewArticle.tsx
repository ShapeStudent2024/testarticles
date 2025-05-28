import React from "react";
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

const NewArticle = () => {
    const handleFormSubmit = (values:any) => {
        const title = values.title;
        const context = values.context;
        console.log(values, title, context);
    }
    const contentRules = [
        {required: true, message: 'Please input a context'}
    ]
    return (
        <Form name="article" onFinish={(values)=>handleFormSubmit(values)}>
            <Form.Item name="title" label="Title" rules={contentRules}>
                <Input/>
            </Form.Item>
            <Form.Item name="context" label="Context" rules={contentRules}>
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    );
}



export default NewArticle;