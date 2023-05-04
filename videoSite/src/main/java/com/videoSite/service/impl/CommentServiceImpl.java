package com.videoSite.service.impl;

import com.videoSite.entity.Comment;
import com.videoSite.mapper.CommentMapper;
import com.videoSite.service.CommentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 */
@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

}
