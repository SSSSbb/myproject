package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacTodoDto;
import com.icodeview.rock.admin.dto.UserPreferencesDto;
import com.icodeview.rock.admin.mapper.RbacUserPreferencesMapper;
import com.icodeview.rock.admin.pojo.RbacTodo;
import com.icodeview.rock.admin.pojo.RbacUserPreferences;
import com.icodeview.rock.admin.service.RbacUserPreferencesService;
import com.icodeview.rock.admin.vo.RbacTodoVo;
import com.icodeview.rock.admin.vo.RbacUserPreferencesVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RbacUserPreferencesServiceImpl extends ServiceImpl<RbacUserPreferencesMapper, RbacUserPreferences> implements RbacUserPreferencesService {
    @Override
    public PageResult<RbacUserPreferencesVo> getIndex(Long id, Long userid, Integer noWorkDay, Integer belongto, Integer noMoreThanTime, Long pageNum, Long pageSize){
        Page<RbacUserPreferences> preferences = new Page<>(pageNum,pageSize);
        Page<RbacUserPreferences> page= lambdaQuery()
                .eq(id != null , RbacUserPreferences::getId, id)
                .eq(userid != null , RbacUserPreferences::getUserid, userid)
                .eq(belongto != null , RbacUserPreferences::getBelongto, belongto)
                .eq(noWorkDay != null , RbacUserPreferences::getNoWorkDay, noWorkDay)
                .eq(noMoreThanTime != null , RbacUserPreferences::getNoMoreThanTime, noMoreThanTime)
                .orderByDesc(RbacUserPreferences::getId)
                .page(preferences);
        List<RbacUserPreferencesVo> record = page.getRecords().stream()
                .map(rbacUserPreferences -> BeanUtil.copyProperties(rbacUserPreferences, RbacUserPreferencesVo.class))
                .collect(Collectors.toList());
        System.out.println(record);
        return PageResult.page(record,page);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createPreferences(UserPreferencesDto preferencesDto) {
        RbacUserPreferences preferences = BeanUtil.copyProperties(preferencesDto, RbacUserPreferences.class);
        preferences.setUserid(preferencesDto.getUserid());
        preferences.setNoWorkDay(preferencesDto.getNoWorkDay());
        preferences.setNoMoreThanTime(preferencesDto.getNoMoreThanTime());
        preferences.setBelongto(preferencesDto.getBelongto());
        System.out.println(preferences);
        save(preferences);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updatePreferences(UserPreferencesDto preferencesDto) {
        RbacUserPreferences preferences = BeanUtil.copyProperties(preferencesDto, RbacUserPreferences.class);
        preferences.setId(preferencesDto.getId());
        preferences.setUserid(preferencesDto.getUserid());
        preferences.setNoWorkDay(preferencesDto.getNoWorkDay());
        preferences.setNoMoreThanTime(preferencesDto.getNoMoreThanTime());
        preferences.setBelongto(preferencesDto.getBelongto());
        updateById(preferences);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deletePreferences(Integer id) {
        RbacUserPreferences preferences = getById(id);
        removeById(preferences.getId());
    }
}
