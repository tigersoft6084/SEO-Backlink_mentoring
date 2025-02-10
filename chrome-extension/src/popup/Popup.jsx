"use client";  // 🚀 Ensures component only runs in the browser
/* global chrome */
import { useEffect, useState } from "react";
import { Button, Form, Input, Space, message, Spin, Table, Empty, Typography } from 'antd';
import PropTypes from 'prop-types';
import { getApiKey, saveApiKey } from "../utils/storage";
import { fetchMarketplaceData, normalizeDomain, validateApiKey } from "../utils/api";
import '../style.css'

const { Title } = Typography;


function LinkFinderExtension() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [data, setData] = useState(null);
    const [dataSource, setDataSource] = useState([]);


    useEffect(() => {
        if (typeof window === "undefined") return; // ✅ Prevent SSR access
        // Check if API key is already saved
        getApiKey((savedKey) => {
            if (savedKey) {
                setIsAuthenticated(true);
                fetchData(savedKey);
            }
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (data && data.result) {
            const formattedData = data.result.map((marketplace, index) => ({
                key: index,
                platform: marketplace.marketplace_source,
                price: marketplace.price,
            }));
            setDataSource(formattedData); // Update state with the new data
        }
    }, [data]); // Re-run effect when data changes

    const fetchData = async (apiKey) => {

        let tabUrl;

        setDataLoading(true);

        chrome.tabs.query({ active: true, currentWindow: true }, async(tabs) => {
            if (tabs.length > 0) {
                console.log("Current Tab URL:", tabs[0].url); // Logs the current tab's URL
                tabUrl = tabs[0].url;

                // Now that we have the URL, normalize the domain
                const domain = normalizeDomain(tabUrl);
                console.log("Normalized Domain:", domain); // Debug the normalized domain

                if(domain){
                    try {
                        const response = await fetchMarketplaceData(domain, apiKey);
                        // Check if the response is valid and contains the necessary data
                        if (response && response.message) {
                            setData(response);
                        } else {
                            setError("No data found.");
                            setData(null);  // Set data to null if no message or result is found
                        }
                    } catch (err) {
                        console.log(err);
                        setError("Failed to fetch data.");
                        setData(null);
                    }finally{
                        setDataLoading(false);
                    }
                }else{
                    console.log("Invalid domain.");
                    setError("Failed to normalize the URL.");
                    setDataLoading(false);
                }
            }else{
                setDataLoading(false);
            }
        });


    };

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
                fetchData();
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

        const columns = [
            {
                title: "Platform",
                width: 100,
                dataIndex: "platform",
                key: "platform",
                fixed: "left",
            },
            {
                title: "Price",
                width: 100,
                dataIndex: "price",
                key: "price",
                fixed: "left",
                sorter: (a, b) => a.price - b.price,
            },
            {
                title: "GO",
                key: "go",
                fixed: "right",
                width: 100,
                render: (_, record) => {
                    // Default base URL
                    let baseUrl;

                    // Switch to change the base URL based on record.key
                    switch (record.platform) {
                        case "123media":
                            baseUrl = `https://123.media/?url=${record.platform}&code=29ae667983`;
                            break;
                        case "Presswhizz":
                            baseUrl = `https://app.presswhizz.com/marketplace?portalName=${record.platform}`;
                            break;
                        case "Prnews":
                            baseUrl = `https://prnews.io/sites/query/${record.platform}/?i=3745304`;
                            break;
                        case "Backlinked":
                            baseUrl = `https://backlinked.com/?ref=mzu2nwe&domain=${record.platform}`;
                            break;
                        case "Growwer":
                            baseUrl = `https://growwer.com/?af=3dce24df39a94a6a92b3f83951f0a618&domain=${record.platform}`;
                            break;
                        case "Ereferer":
                            baseUrl = `https://fr.ereferer.com/bo/exchange-site-find?search=${record.platform}`;
                            break;
                        case "Linkbroker":
                            baseUrl = `https://app.linkbroker.de/en/contentlinks?domain=${record.platform}`;
                            break;
                        case "Paperclub":
                            baseUrl = `https://app.paper.club/annonceur/results?type=simple&term=${record.platform}`;
                            break;
                        case "Whitepress":
                            baseUrl = `https://www.whitepress.com/Xn9pi`;
                            break;
                        case "Develink":
                            baseUrl = `https://app.develink.com/cataloguevip?search_type=search_url&search_domain=${record.platform}&code=JGADANHO`;
                            break;
                        case "Linkatomic":
                            baseUrl = `https://app.linkatomic.com/register/r/6b04380b67c55d6075bc2f0a9534f0cd?domain=${record.platform}`;
                            break;
                        case "Linkbuilders":
                            baseUrl = `https://app.link.builders/links?domain=${record.platform}`;
                            break;
                        case "Motherlink":
                            baseUrl = `https://app.motherlink.io/market?domain=${record.platform}`;
                            break;
                        case "Seojungle":
                            baseUrl = `https://app.seo-jungle.com/fr/search?searchField=${record.platform}&orders=`;
                            break;
                        case "Mynilinks":
                            baseUrl = `https://app.mynilinks.fr/netlinkings?country=&category=&url=${record.platform}&ttf=&tf_min=&tf_max=&cf_min=&cf_max=&dr_min=&dr_max=&mots_cles=&traffic_min=&traffic_max=&min_price=&max_price=&pagination=10&sponsor_id=7e2c23fd-5929-4a0d-b3f1-94eed47dcb1f`;
                            break;
                        case "Mistergoodlink":
                            baseUrl = `https://app.mistergoodlink.com/shop?ref=${record.platform}`;
                            break;
                        case "Getalink":
                            baseUrl = `https://app.getalink.com/v2/client/marketplace`;
                            break;
                        case "Unancor":
                            baseUrl = `https://app.unancor.com/?aaf=ed161410-1f90-11ef-b5c7-0e52f3fe678a&domain=${record.platform}`;
                            break;
                        case "Publisuites":
                            baseUrl = `https://www.publisuites.com/advertisers/websites/`;
                            break;
                        case "Linkavistar":
                            baseUrl = `https://linkavistar.com/linkfinder/?domain=${record.platform}`;
                            break;
                        case "Lemmilink":
                            baseUrl = `https://app.lemmilink.fr/AnnonceMode?url=${record.platform}&ref=cc6f3b`;
                            break;
                        case "Soumettre":
                            baseUrl = `https://soumettre.fr/user/catalog?url=${record.platform}&parrain=DJKOXI`;
                            break;
                        case "Boosterlink":
                            baseUrl = `https://pro.boosterlink.fr/comparateurs.aspx`;
                            break;
                        case "Dealerdetemps":
                            baseUrl = `https://www.dealerdetemps.com/les-sites/`;
                            break;
                        default:
                            break;
                    }

                    return (
                        <a href={baseUrl} target="_blank" rel="noopener noreferrer">
                            GO
                        </a>
                    );
                },
            },
        ];

        return (
            <div className="p-4 w-64 bg-gray-100 dark:bg-gray-800">
                {dataLoading ? (
                    <Spin size="large" />
                ) : (
                    <div>
                        {data ? (
                            <>
                                {data.result && data.result.length > 0 ? (
                                    <Table pagination={false} columns={columns} dataSource={dataSource} />
                                ) : (
                                    <div style={{width : '200px', height : '100px', justifyContent : "center",  alignItems: 'center'}}>
                                        <div>
                                            {<Empty description={false} />}
                                            <Space
                                                direction="vertical"
                                                style={{ width: "100%", justifyContent: "center", display: "flex" }}
                                            >
                                                <Title level={4} type="danger" style={{ textAlign: "center" }}>
                                                    No marketplaces available.
                                                </Title>
                                            </Space>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{width : '200px', height : '100px', justifyContent : "center",  alignItems: 'center'}}>
                                <div>
                                    {<Empty description={false} />}
                                    <Space
                                        direction="vertical"
                                        style={{ width: "100%", justifyContent: "center", display: "flex" }}
                                    >
                                        <Title level={4} type="danger" style={{ textAlign: "center" }}>
                                            No marketplaces available.
                                        </Title>
                                    </Space>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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
