package com.videoSite.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;


@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("m_subscribe")
public class Subscribe implements Serializable {

    private static final long serialVersionUID = 1L;

    private String youtuber;

    private String subscriber;

    private Date subscribe_time;

}
