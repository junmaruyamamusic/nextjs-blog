import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark';
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData(){
    //posts配下のファイル名を取得
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostData = fileNames.map(fileName =>{
        //idを取得するためファイル名から.md を削除
        const id  = fileName.replace(/\.md$/,'')

        //マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory,fileName)
        const fileContents = fs.readFileSync(fullPath,'utf8')

        //投稿のメタデータ部分解析のためgray-matter遣う
        const matterResult = matter(fileContents)

        //データをidと合わせる
        return{
            id,
            ...matterResult.data
        }
    })
    //投稿を日付けでソートする
    return allPostData.sort((a,b) => {
        if(a.date <b.date){
            return 1
        }else{
            return -1
        }
    })
}


export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory)
    // 以下のような配列を返します:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map(fileName => {
      return{
          params:{
              id: fileName.replace(/\.md$/,'')
        }
      }
  })
}

export async function getPostData(id){
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath,'utf8')

    //投稿のメタデータ部分を解析するためgray-matter遣う
    const matterResult = matter(fileContents)

    //マークダウンをHTML文字列にかえる
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()


    return{
        id,
        contentHtml,
        ...matterResult.data
    }
}