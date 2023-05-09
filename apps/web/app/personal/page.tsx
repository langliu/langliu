import styles from './page.module.css'
import NavCard from '@/components/NavCard'
import React, { FC } from 'react'

const PersonalPage: FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">个人主页</h1>
      <div>
        <div>
          <p className='text-3xl mb-4'>影视下载</p>
        </div>
        <div className={styles.navWrapper}>
          <NavCard
            title="云盘资源社区"
            href="https://yunpan1.com/"
            tags={['动漫', '高清', '电影', '阿里云']}
            description="阿里云网盘资源分享社区，涉及各类影视和资料"
            iconUrl="http://www.549.tv/icon/yunpan1.png"
          />
          <NavCard
            title="电影天堂"
            href="https://dytt8.net/"
            tags={['高清', '电影', '下载']}
            description="老牌下载站，资源丰富"
            iconUrl="https://dytt8.net/favicon.ico"
          />
          <NavCard
            title="高清电台"
            href="https://gaoqing.fm/"
            tags={['高清', '电影', '电视剧', '下载']}
            description="1080P/4K高清片源下载"
            iconUrl="https://gaoqing.fm/favicon.ico"
          />
          <NavCard
            title="阿里云盘资源共享站"
            href="https://pan666.net/"
            tags={['电影', '电视剧', '下载']}
            description="阿里云盘资源，很多精心整理的资源合集"
            iconUrl="http://www.549.tv/icon/yunpan1.png"
          />
        </div>
      </div>
    </div>
  )
}

export default PersonalPage
