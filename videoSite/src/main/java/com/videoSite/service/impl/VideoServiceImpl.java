package com.videoSite.service.impl;

import com.videoSite.entity.Video;
import com.videoSite.mapper.VideoMapper;
import com.videoSite.service.VideoService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 */
@Service
public class VideoServiceImpl extends ServiceImpl<VideoMapper, Video> implements VideoService {

}
