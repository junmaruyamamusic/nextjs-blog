import Layout from '../../components/layout'
import {getAllPostIds,getPostData} from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({postData}){
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingX1}>{postData.title}</h1>
                <div className={utilStyles.lightText}></div>
                    <Date dateString={postData.date} />
                <div/>
                <div/>
                <img src={`/images/${postData.imageFileName}`} alt="Image" />
                <div dangerouslySetInnerHTML={{ __html:postData.contentHtml}} />
            </article>
        </Layout>
    )
}

export async function getStaticPaths(){
    //idとしてとりうる値のリストを返す
    // await キーワードを追加
    const paths = await getAllPostIds()
    return{
        paths,
        fallback: false
    }
}


export async function getStaticProps({params}){
    //params.idを使用してブログ投稿に必要なデータを取得する
    const postData = await getPostData(params.id)
    return{
        props:{
            postData
        }
    }
}

