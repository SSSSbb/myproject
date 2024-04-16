package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacBasicInfoDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.mapper.RbacBasicInfoMapper;
import com.icodeview.rock.admin.pojo.RbacBasicInfo;
import com.icodeview.rock.admin.pojo.RbacProfile;
import com.icodeview.rock.admin.service.RbacBasicInfoService;
import com.icodeview.rock.admin.vo.RbacBasicInfoVo;
import com.icodeview.rock.admin.vo.RbacProfileVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class RbacBasicInfoServiceImpl extends ServiceImpl<RbacBasicInfoMapper, RbacBasicInfo> implements RbacBasicInfoService {
    @Override
    public PageResult<RbacBasicInfoVo> getIndex(Integer id,Integer profileid,String name,Integer belongto,Long pageNum, Long pageSize) {
        Page<RbacBasicInfo> rbacBasicPage = new Page<>(pageNum, pageSize);
        Page<RbacBasicInfo> page = lambdaQuery()
                .eq(id != null , RbacBasicInfo::getId, id)
                .eq(profileid != null , RbacBasicInfo::getProfileid, profileid)
                .and(StrUtil.isNotBlank(name), q -> q.like(RbacBasicInfo::getName, "%" + name + "%"))
                .eq(belongto != null , RbacBasicInfo::getBelongto, belongto)
                .orderByDesc(RbacBasicInfo::getId)
                .page(rbacBasicPage);
        List<RbacBasicInfoVo> record = page.getRecords().stream()
                .map(rbacBasicInfo -> BeanUtil.copyProperties(rbacBasicInfo, RbacBasicInfoVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createBasicInfo(RbacBasicInfoDto basicInfoDto) {
        RbacBasicInfo basicInfo = BeanUtil.copyProperties(basicInfoDto, RbacBasicInfo.class);
        basicInfo.setName(basicInfoDto.getName());
        basicInfo.setProfileid(basicInfoDto.getProfileid());
        basicInfo.setBelongto(basicInfoDto.getBelongto());
        basicInfo.setCreatedAt(LocalDateTime.now());
        basicInfo.setUpdatedAt(LocalDateTime.now());
        System.out.println(basicInfo);
        save(basicInfo);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteBasicInfo(Integer id) {
        RbacBasicInfo pro = getById(id);
        removeById(pro.getId());
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateBasicInfo(RbacBasicInfoDto basicInfoDto) {
        RbacBasicInfo basicInfo = BeanUtil.copyProperties(basicInfoDto, RbacBasicInfo.class);
        basicInfo.setId(basicInfoDto.getId());
        basicInfo.setName(basicInfoDto.getName());
        basicInfo.setProfileid(basicInfoDto.getProfileid());
        basicInfo.setBelongto(basicInfoDto.getBelongto());
        basicInfo.setCreatedAt(LocalDateTime.now());
        basicInfo.setUpdatedAt(LocalDateTime.now());
        updateById(basicInfo);
    }
}
