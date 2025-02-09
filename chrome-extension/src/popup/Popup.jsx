"use client";  // 🚀 Ensures component only runs in the browser

import { useEffect, useState } from "react";
import { getApiKey, saveApiKey } from "../utils/storage";
import { validateApiKey } from "../utils/api";
import { Button, Form, Input, Space, message } from 'antd';
import PropTypes from 'prop-types';
import '../style.css'


function LinkFinderExtension() {
    // const [apiKey, setApiKey] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (typeof window === "undefined") return; // ✅ Prevent SSR access
        // Check if API key is already saved
        getApiKey((savedKey) => {
            if (savedKey) {
                setIsAuthenticated(true);
            }
        });
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);

        if (!values.apiKey) {
            setError("API Key is required!");
            return;
        }

        try {
            const isValid = await validateApiKey(values.apiKey);

            if (isValid) {
                saveApiKey(values.apiKey);
                setIsAuthenticated(true);
            } else {
                setError("Invalid API Key. Please try again.");
            }

            message.success("API key saved successfully!");
            form.resetFields();
        } catch (error) {
            message.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const SubmitButton = ({ form, children }) => {

        SubmitButton.propTypes = {
            form: PropTypes.object.isRequired,
            children: PropTypes.node.isRequired,
        };

        const [submittable, setSubmittable] = useState(false);

        // Watch all values
        const values = Form.useWatch([], form);

        // Watch all values directly from form
        useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);

        return (
            <Button
                type="primary"
                htmlType="submit"
                style={{
                opacity: submittable ? 1 : 0.5, // Changes opacity instead of disabling
                cursor: submittable ? "pointer" : "not-allowed", // Updates cursor style
                }}
                loading={loading}
            >
                {children}
            </Button>
        );
    }


    if (isAuthenticated) {
        return (
            <div className="p-4 w-64 bg-gray-100 dark:bg-gray-800">
                <h2 className="text-lg font-bold">SEO Checker</h2>
                <p>Extension is ready to use!</p>
            </div>
        );
    }

    return (
        <div>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="apiKey"
                    rules={[
                    {
                        required: true,
                        message: "API key is required!",
                    },
                    ]}
                >
                    <Input placeholder="Please Enter Your API key!" />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <SubmitButton form={form}>Save API key</SubmitButton>
                    </Space>
                </Form.Item>

                <Form.Item>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </Form.Item>
            </Form>
        </div>

    );
}

export default LinkFinderExtension;
